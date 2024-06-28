const {success} = require("../../utils/Console");
const Event = require("../../structure/Event");

function ensureGuildSettings(guildSettings) {
    const defaultSettings = {
        welcomeMessage: false,
        welcomeChannel: "",
        CharNameAsk: false,
        BlockList: true, // Add any other default settings here
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

function updateGuildSettings(client) {
    let settings = client.database.get("settings") || [];

    // Fetch all guilds the bot is currently in and store their IDs in a set
    const currentGuildIds = new Set(client.guilds.cache.keys());

    // Filter the settings array to only include entries for guilds the bot is currently in
    settings = settings.filter(setting => currentGuildIds.has(setting.guild));

    // For each guild the bot is currently in, ensure it has a settings entry
    for (const guildId of currentGuildIds) {
        let guildSettings = settings.find(setting => setting.guild === guildId);
        if (!guildSettings) {
            guildSettings = {guild: guildId};
            settings.push(guildSettings);
        }

        // Ensure the guild settings have all necessary entries
        if (ensureGuildSettings(guildSettings)) {
            client.database.set("settings", settings);
        }
    }

    // Save the updated settings back to the database
    client.database.set("settings", settings);
}

module.exports = new Event({
    event: 'ready', once: true, run: (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.")

        // Update guild settings immediately after bot has connected
        updateGuildSettings(client);

        // Schedule the task to run every 2 hours
        setInterval(() => {
            updateGuildSettings(client);
        }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
    }
}).toJSON();