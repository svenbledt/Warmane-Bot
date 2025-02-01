const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const Logger = require('../../utils/Logger');

const TIMEOUT_DURATION = 600000; // 10 minutes in milliseconds
const REQUIRED_PERMISSION = PermissionsBitField.Flags.BanMembers;

module.exports = new ApplicationCommand({
  command: {
    name: "charname",
    description: "Ask's someone for his Character name.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "user",
        description: "The user to ask for his Charname.",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  options: {
    cooldown: 5000,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    try {
      const user = interaction.options.getUser("user", true);
      const member = interaction.guild.members.cache.get(user.id);
      
      // Get guild settings for language and custom DM message
      const guildSettings = await client.database_handler.findOne('settings', {
        guild: interaction.guildId
      });
      const lang = guildSettings?.language || "en";

      if (!interaction.member.permissions.has([REQUIRED_PERMISSION])) {
        await interaction.editReply({
          content: LanguageManager.getText('commands.global_strings.no_permission', lang)
        });
        return;
      }

      try {
        const dmChannel = await member.createDM();
        const dmMessage = guildSettings?.charNameAskDM || 
                         LanguageManager.getText('commands.charname.dm_initial', lang);
        
        await dmChannel.send(dmMessage);
        
        await Logger.log(client, interaction.guildId, {
          titleKey: 'dm_sent',
          descData: { username: member.user.tag },
          color: '#00ff00',
          fields: [
            { nameKey: 'user_label', value: member.user.tag },
            { nameKey: 'user_id', value: member.user.id }
          ]
        });

        await interaction.editReply({
          content: LanguageManager.getText('commands.global_strings.dm_sent', lang, {
            username: member.user.tag
          })
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
            
            await Logger.log(client, interaction.guildId, {
              titleKey: 'nickname_changed',
              descData: { username: member.user.tag, nickname: response },
              color: '#00ff00',
              fields: [
                { nameKey: 'user_label', value: member.user.tag },
                { nameKey: 'user_id', value: member.user.id },
                { nameKey: 'new_nickname', value: response }
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

          await Logger.log(client, interaction.guildId, {
            titleKey: 'dm_timeout',
            descData: { username: member.user.tag },
            color: '#ff0000',
            fields: [
              { nameKey: 'user_label', value: member.user.tag },
              { nameKey: 'user_id', value: member.user.id }
            ]
          });
        }
      } catch (error) {
        console.error(`Failed to handle DM interaction: ${error.message}`);
        
        await interaction.editReply({
          content: LanguageManager.getText('commands.global_strings.dm_failed', lang, {
            username: member.user.tag
          })
        });
        
        await Logger.log(client, interaction.guildId, {
          titleKey: 'dm_failed',
          descData: { username: member.user.tag },
          color: '#ff0000',
          fields: [
            { nameKey: 'user_label', value: member.user.tag },
            { nameKey: 'user_id', value: member.user.id },
            { nameKey: 'error_label', value: error.message }
          ]
        });
      }
    } catch (error) {
      console.error('Error in charname command:', error);
      await interaction.editReply({
        content: 'An error occurred while processing the command.'
      });
    }
  },
});
