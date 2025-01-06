const { MessageFlags, ChatInputCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
  command: {
    name: 'help',
    description: 'Replies with a list of available application commands.',
    type: 1,
    options: [],
  },
  options: {
    cooldown: 10000
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Reply with a list of available application commands. but exclude the help command and only include slashcommands. (no usercontext commands)
    await interaction.reply({
      content: `${client.collection.application_commands
        .filter((cmd) => cmd.command.name !== "help" && cmd.command.name !== "Ask for Charname")
        .map((cmd) => "`/" + cmd.command.name + "`")
        .join(", ")}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();