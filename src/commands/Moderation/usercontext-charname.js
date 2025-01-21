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
   * @param {DiscordBot} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const member = interaction.targetMember;
    // Get guild settings for language and custom DM message
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    if (!interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers])) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.no_permission', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (!member) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.invalid_target', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    try {
      // Use the custom DM message from database or fallback to default
      const dmMessage = guildSettings?.charNameAskDM || 
                       LanguageManager.getText('commands.charname.dm_initial', lang);
      await member.send(dmMessage);
    } catch (error) {
      console.error(`Failed to send a DM to ${member.user.tag}.`);
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.dm_failed', lang, {
          username: member.user.tag
        }),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    await interaction.reply({
      content: LanguageManager.getText('commands.global_strings.dm_sent', lang, {
        username: member.user.tag
      }),
      flags: [MessageFlags.Ephemeral],
    });

    const filter = (m) => m.author.id === member.id;
    const handleResponse = async (collected) => {
      let response = collected.first().content;
      response = response.replace(/[^a-zA-Z ]/g, "");
      
      if (response.trim() === "") {
        await member.dmChannel.send(
          LanguageManager.getText('commands.charname.empty_response', lang)
        );
      } else {
        try {
          await member.setNickname(response);
          console.log(`Changed ${member.user.tag} nickname to ${response}.`);
          await member.dmChannel.send(
            LanguageManager.getText('commands.charname.nickname_success', lang, {
              nickname: response
            })
          );
        } catch (error) {
          console.error(`Failed to change ${member.user.tag} nickname to ${response}.`);
          await member.dmChannel.send(
            LanguageManager.getText('commands.charname.nickname_failed', lang, {
              error: error.message
            })
          );
        }
      }
    };

    if (!member.dmChannel) {
      try {
        const dmChannel = await member.createDM();
        const collected = await dmChannel.awaitMessages({ 
          filter, 
          max: 1, 
          time: 60000, 
          errors: ["time"] 
        });
        await handleResponse(collected);
      } catch (error) {
        console.error(`Failed to get a response from ${member.user.tag}.`);
      }
    } else {
      try {
        const collected = await member.dmChannel.awaitMessages({ 
          filter, 
          max: 1, 
          time: 60000, 
          errors: ["time"] 
        });
        await handleResponse(collected);
      } catch (error) {
        console.error(`Failed to get a response from ${member.user.tag}.`);
      }
    }
  },
}).toJSON();
