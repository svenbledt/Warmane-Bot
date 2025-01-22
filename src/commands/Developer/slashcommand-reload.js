const {
  MessageFlags,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

module.exports = new ApplicationCommand({
  command: {
    name: "reload",
    description: "Reloads all commands.",
    type: 1,
    contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
  },
  options: {
    botDevelopers: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    try {
      client.commands_handler.reload();

      await client.commands_handler.registerApplicationCommands(
        config.development
      );

      await interaction.editReply({
        content:
          "Successfully reloaded application commands and message commands.",
        flags: [MessageFlags.Ephemeral],
      });
    } catch (err) {
      await interaction.editReply({
        content: "Something went wrong.",
        files: [
          new AttachmentBuilder(Buffer.from(`${err}`, "utf-8"), {
            name: "output.ts",
          }),
        ],
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
}).toJSON();
