const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");

module.exports = new Event({
  event: "guildDelete",
  once: false,
  run: async (client, guild) => {
    // Get current settings and remove the guild
    let settings = client.database.get("settings") || [];
    settings = settings.filter((setting) => setting.guild !== guild.id);
    client.database.set("settings", settings);

    // Remove any other guild-specific data from the database
    // Add more database cleanup here if you have other collections

    success(
      `Guild ${guild.name} (${guild.id}) has been removed from the database.`
    );

    try {
      const announcementChannel = client.channels.cache.get(
        config.development.announcementChannel
      );
      if (announcementChannel) {
        await announcementChannel.send({
          content: `**${guild.name} (${guild.id}) has left the Project!**`,
        });
      }
    } catch (error) {
      console.error("Failed to send guild deletion announcement:", error);
    }
  },
})
