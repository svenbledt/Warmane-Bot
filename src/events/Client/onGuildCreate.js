const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",  // Add default language setting
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
    lastOwnerDM: {},
    // Add any other default settings here
  };

  let updated = false;

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!guildSettings.hasOwnProperty(key)) {
      guildSettings[key] = value;
      updated = true;
    }
  }

  return updated;
}

async function updateGuildSettings(client) {
  let settings = client.database.get("settings") || [];
  const currentGuildIds = new Set(client.guilds.cache.keys());

  settings = settings.filter((setting) => currentGuildIds.has(setting.guild));

  for (const guildId of currentGuildIds) {
    let guildSettings = settings.find((setting) => setting.guild === guildId);
    const guildName = client.guilds.cache.get(guildId).name;

    if (!guildSettings) {
      guildSettings = {
        guild: guildId,
        guildName: guildName,
      };
      settings.push(guildSettings);
    } else {
      guildSettings.guildName = guildName;
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }
  }

  client.database.set("settings", settings);
}

module.exports = new Event({
  event: "guildCreate",
  once: false,
  run: async (client, guild) => {
    const announcementChannel = client.channels.cache.get(
      config.development.announcementChannel
    );

    success(
      `Guild ${guild.name} (${guild.id}) has been added to the database.`
    );
    await announcementChannel.send({
      content: `**${guild.name} (${guild.id}) has joined the Project!**`,
    });

    // Update settings
    await updateGuildSettings(client);
  },
}).toJSON();
