const {
  MessageFlags,
  UserContextMenuCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require('../../utils/LanguageManager');

module.exports = new ApplicationCommand({
  command: {
    name: "Ask for Charname",
    type: 2,
  },
  options: {
    cooldown: 5000,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const member = interaction.targetMember;
    // You can get the guild's preferred language from settings, defaulting to 'en'
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    if (!interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers])) {
      await interaction.reply({
        content: LanguageManager.getText('commands.charname.no_permission', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (!member) {
      await interaction.reply({
        content: LanguageManager.getText('commands.charname.invalid_target', lang),
      });
      return;
    }

    // Send message to the user and await for his response with his character main name
    try {
      await member.send(LanguageManager.getText('commands.charname.dm_initial', lang));
    } catch (error) {
      console.error(`Failed to send a DM to ${member.tag}.`);
      await interaction.reply({
        content: LanguageManager.getText('commands.charname.dm_failed', lang, { username: member.tag }),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
    // Reply to the interaction
    try {
      await interaction.reply({
        content: LanguageManager.getText('commands.charname.dm_sent', lang),
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error(`Failed to reply to the interaction.`);
      return;
    }
    // Await for users response to the DM and change his nickname
    const filter = (m) => m.author.id === member.id;
    if (!member.dmChannel) {
      member
        .createDM()
        .then((dmChannel) => {
          dmChannel
            .awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
            .then((collected) => {
              let response = collected.first().content;
              // Replace special characters and numbers
              response = response.replace(/[^a-zA-Z ]/g, "");
              if (response.trim() === "") {
                dmChannel.send(LanguageManager.getText('commands.charname.empty_response', lang));
              } else {
                member
                  .setNickname(response)
                  .then(() => {
                    console.log(
                      `Changed ${member.user.tag} nickname to ${response}.`
                    );
                    dmChannel.send(LanguageManager.getText('commands.charname.nickname_success', lang, { nickname: response }));
                  })
                  .catch((error) => {
                    console.error(
                      `Failed to change ${member.user.tag} nickname to ${response}.`
                    );
                    dmChannel.send(LanguageManager.getText('commands.charname.nickname_failed', lang, { error: error.message }));
                  });
              }
            })
            .catch((error) => {
              console.error(
                `Failed to get a response from ${member.user.tag}.`
              );
            });
        })
        .catch((error) => {
          console.error(
            `Failed to create a DM channel with ${member.user.tag}.`
          );
        });
    } else {
      member.dmChannel
        .awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          let response = collected.first().content;
          // Replace special characters and numbers
          response = response.replace(/[^a-zA-Z ]/g, "");
          if (response.trim() === "") {
            member.dmChannel.send(LanguageManager.getText('commands.charname.empty_response', lang));
          } else {
            member
              .setNickname(response)
              .then(() => {
                console.log(
                  `Changed ${member.user.tag} nickname to ${response}.`
                );
                member.dmChannel.send(LanguageManager.getText('commands.charname.nickname_success', lang, { nickname: response }));
              })
              .catch((error) => {
                console.error(
                  `Failed to change ${member.user.tag} nickname to ${response}.`
                );
                member.dmChannel.send(LanguageManager.getText('commands.charname.nickname_failed', lang, { error: error.message }));
              });
          }
        })
        .catch((error) => {
          console.error(`Failed to get a response from ${member.user.tag}.`);
        });
    }
  },
}).toJSON();
