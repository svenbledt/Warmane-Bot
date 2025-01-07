const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist-remove",
    description: "Remove someone from the Global blacklist.",
    type: 1,
    options: [
      {
        name: "id",
        description: "The ID of the user to remove from the blacklist.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  options: {
    botDevelopers: true,
  },
  run: async (client, interaction) => {
    let obj = client.database.get("blacklisted") || [];
    const removeId = interaction.options.getString("id");
    if (removeId) {
      // Check if the ID is in the blacklist
      if (!obj.some((user) => user.id === removeId)) {
        await interaction.reply({
          content: "The user is not in the blacklist.",
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      // Remove the user from the blacklist
      obj = obj.filter((user) => user.id !== removeId);
      client.database.set("blacklisted", obj);

      await interaction.reply({
        content: "I have removed the user from the blacklist.",
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: "You must provide an ID to remove from the blacklist.",
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
}).toJSON();
