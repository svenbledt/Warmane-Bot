const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
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
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Get guild settings for language
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    const date = new Date();
    const time = date.toLocaleTimeString("en-US", {
      timeZone: "Atlantic/Reykjavik",
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

    await interaction.reply({ embeds: [embed] });
  },
}).toJSON();
