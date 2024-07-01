const {success} = require("../../utils/Console");
const Event = require("../../structure/Event");
const {ActivityType} = require("discord.js");

function ensureGuildSettings(guildSettings) {
    const defaultSettings = {
        welcomeMessage: false, welcomeChannel: "", CharNameAsk: false, BlockList: true, // Add any other default settings here
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

    const currentGuildIds = new Set(client.guilds.cache.keys());

    settings = settings.filter(setting => currentGuildIds.has(setting.guild));

    for (const guildId of currentGuildIds) {
        let guildSettings = settings.find(setting => setting.guild === guildId);
        const guildName = client.guilds.cache.get(guildId).name; // Hole den Gildennamen

        if (!guildSettings) {
            // Erstelle eine neue Einstellung mit dem Gildennamen an erster Stelle
            guildSettings = {guild: guildId, guildName: guildName};
            settings.push(guildSettings);
        } else {
            // Aktualisiere den Gildennamen, falls er sich geändert hat
            guildSettings.guildName = guildName;
        }

        if (ensureGuildSettings(guildSettings)) {
            client.database.set("settings", settings);
        }
    }

    client.database.set("settings", settings);
}

function updateStatus(client) {
    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    client.user.setPresence({
        activities: [{
            name: "keep this empty", type: 4, state: `Serving ${users} players in ${guilds} guilds`
        }], status: 'dnd',
    });

}

module.exports = new Event({
    event: 'ready', once: true, run: (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.")

        // Update guild settings immediately after bot has connected
        updateGuildSettings(client);
        updateStatus(client);

        // Schedule the task to run every 2 hours
        setInterval(() => {
            updateGuildSettings(client);
        }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
        setInterval(() => {
            updateStatus(client);
        }, 4000); // 5 minutes in milliseconds
    }
}).toJSON();