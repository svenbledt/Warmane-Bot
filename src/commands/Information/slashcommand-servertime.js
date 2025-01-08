const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

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
    // print the actual time of Iceland to the interaction channel
    const date = new Date();
    const time = date.toLocaleTimeString("en-US", {
      timeZone: "Atlantic/Reykjavik",
    });
    const embed = new EmbedBuilder()
      .setTitle("Servertime")
      .setDescription(`The current servertime is: ${time}`)
      .setColor("#8B0000")
      .setTimestamp()
      .setFooter({
        text: "Requested by: " + interaction.user.tag,
        iconURL: interaction.user.avatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
}).toJSON();
