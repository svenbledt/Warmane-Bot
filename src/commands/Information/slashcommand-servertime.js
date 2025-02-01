const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  MessageFlags
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "servertime",
    description: "Get the servertime of Warmane",
    type: 1,
    contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [],
  },
  options: {
    cooldown: 60000,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      // Skip deferReply if the interaction was already handled (e.g., by cooldown)
      if (!interaction.replied) {
        await interaction.deferReply();
      }

      // Get guild settings for language
      const guildSettings = await client.database_handler.findOne('settings', {
        guild: interaction.guildId
      });
      const lang = guildSettings?.language || 'en';

      const date = new Date();
      const time = date.toLocaleTimeString("en-US", {
        timeZone: "Atlantic/Reykjavik",
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const embed = new EmbedBuilder()
        .setTitle(LanguageManager.getText('commands.servertime.embed.title', lang))
        .setDescription(LanguageManager.getText('commands.servertime.embed.description', lang, { time: time }))
        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: LanguageManager.getText('commands.servertime.embed.footer', lang, { 
            user: interaction.user.tag 
          }),
          iconURL: interaction.user.avatarURL(),
        });

      // Only editReply if we successfully deferred earlier
      if (interaction.deferred) {
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error in servertime command:', error);
      // Only try to respond if we haven't already
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'An error occurred while fetching the server time.',
          flags: [MessageFlags.Ephemeral]
        }).catch(console.error);
      }
    }
  },
}).toJSON();
