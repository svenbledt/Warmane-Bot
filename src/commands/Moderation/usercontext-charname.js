const {
  MessageFlags,
  UserContextMenuCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require('../../utils/LanguageManager');
const Logger = require('../../utils/Logger');

const TIMEOUT_DURATION = 600000; // 10 minutes
const REQUIRED_PERMISSION = PermissionsBitField.Flags.BanMembers;

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
    const guildSettings = await client.database_handler.findOne('settings', {
      guild: interaction.guildId
    });
    const lang = guildSettings?.language || 'en';

    if (!interaction.member.permissions.has([REQUIRED_PERMISSION])) {
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
      // Create DM channel first
      const dmChannel = await member.createDM();
      
      // Use the custom DM message from database or fallback to default
      const dmMessage = guildSettings?.charNameAskDM || 
                       LanguageManager.getText('commands.charname.dm_initial', lang);
      await dmChannel.send(dmMessage);
      
      // Log successful DM
      await Logger.log(client, interaction.guildId, {
        titleKey: 'dm_sent',
        descData: { username: member.user.tag },
        color: '#00ff00',
        fields: [
          { nameKey: 'dm.user_label', value: member.user.tag },
          { nameKey: 'dm.user_id', value: member.user.id },
        ]
      });

      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.dm_sent', lang, {
          username: member.user.tag
        }),
        flags: [MessageFlags.Ephemeral],
      });

      try {
        const collected = await dmChannel.awaitMessages({ 
          filter: (m) => m.author.id === member.id,
          max: 1, 
          time: TIMEOUT_DURATION,
          errors: ["time"] 
        });
        
        const response = collected.first().content.replace(/[^a-zA-Z ]/g, "").trim();
        
        if (!response) {
          await dmChannel.send(
            LanguageManager.getText('commands.charname.empty_response', lang)
          );
          return;
        }

        try {
          await member.setNickname(response);
          
          // Log nickname change
          await Logger.log(client, interaction.guildId, {
            titleKey: 'nickname_changed',
            descData: { username: member.user.tag, nickname: response },
            color: '#00ff00',
            fields: [
              { nameKey: 'dm.user_label', value: member.user.tag },
              { nameKey: 'dm.user_id', value: member.user.id },
              { nameKey: 'nickname_changed.new_nickname', value: response }
            ]
          });
          
          await dmChannel.send(
            LanguageManager.getText('commands.charname.nickname_success', lang, {
              nickname: response
            })
          );
        } catch (error) {
          console.error(`Failed to change nickname: ${error.message}`);
          await dmChannel.send(
            LanguageManager.getText('commands.charname.nickname_failed', lang, {
              error: error.message
            })
          );
        }
      } catch (timeoutError) {        
        await dmChannel.send(
          LanguageManager.getText('commands.charname.dm_timeout_message', lang, {
            guildName: interaction.guild.name
          })
        );

        // Log the timeout
        await Logger.log(client, interaction.guildId, {
          titleKey: 'dm_timeout',
          descData: { username: member.user.tag },
          color: '#ff0000',
          fields: [
            { nameKey: 'dm.user_label', value: member.user.tag },
            { nameKey: 'dm.user_id', value: member.user.id },
          ]
        });
      }
    } catch (error) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.dm_failed', lang, {
          username: member.user.tag
        }),
        flags: [MessageFlags.Ephemeral],
      });
      
      // Log failed DM
      await Logger.log(client, interaction.guildId, {
        titleKey: 'dm',
        descData: { username: member.user.tag },
        color: '#ff0000',
        fields: [
          { nameKey: 'dm.user_label', value: member.user.tag },
          { nameKey: 'dm.user_id', value: member.user.id },
          { nameKey: 'dm.error_label', value: error.message }
        ]
      });
    }
  },
});
