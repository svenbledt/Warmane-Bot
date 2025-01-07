const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const { MessageFlags } = require("discord.js");
const config = require("../../config");

module.exports = new Event({
  event: "interactionCreate",
  once: false,
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;

    if (!client.commands) {
      console.error('Commands collection is not initialized');
      return await interaction.respond([]);
    }

    if (interaction.commandName === "guild-leave") {
      if (!config.users.developers.includes(interaction.user.id)) {
        return await interaction.respond([]);
      }
      const focusedValue = interaction.options.getFocused().toLowerCase();
      const choices = interaction.client.guilds.cache
        .map((guild) => ({
          name: guild.name,
          value: guild.id,
        }))
        .filter((choice) => choice.name.toLowerCase().includes(focusedValue))
        .slice(0, 25);

      await interaction.respond(choices);
      return;
    }

    await interaction.respond([]);
  },
}).toJSON();
