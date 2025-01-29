const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");
const Logger = require("../../utils/Logger");
const { EmbedBuilder, AuditLogEvent } = require('discord.js');

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",  // Add default language setting
    logChannel: "", // Add logging channel setting
    enableLogging: false, // Add logging toggle
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.",
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

    // Find who invited the bot
    let botAddLog = null; // Declare outside try block
    try {
      const auditLogs = await guild.fetchAuditLogs({
        type: AuditLogEvent.BotAdd,
        limit: 1
      });
      
      botAddLog = auditLogs.entries.first();
      if (botAddLog) {
        const inviter = botAddLog.executor;
        
        const welcomeEmbed = new EmbedBuilder()
          .setTitle(`Thanks for adding me to ${guild.name}! 🎉`)
          .setDescription('Here\'s how to get started with setting up the bot:')
          .setColor("#261b0d")
          .addFields(
            {
              name: '📚 Basic Commands',
              value: '`/help` - View all available commands'
            },
            {
              name: '⚙️ Essential Setup',
              value: [
                '`/setup` - Configure all bot features:',
                '• Welcome Messages & Channel',
                '• Character Name System',
                '• Block List Protection',
                '• Server Logging',
                '• Bot Language',
                '• Custom DM Messages'
              ].join('\n')
            },
            {
              name: '👤 Character Management',
              value: [
                '`/set-char` - Assign a character to a user',
                '`/charname` - Ask a user for their character name',
                'U can also right click on a user and select "Ask for Charname" to ask for a character name'
              ].join('\n')
            },

            {
              name: '🔗 Need Help?',
              value: '[Join our Support Server](https://discord.gg/YDqBQU43Ht)'
            }
          )
          .setFooter({ text: 'Have fun using the bot! 🤖', iconURL: client.user.displayAvatarURL() })
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp();

        await inviter.send({ embeds: [welcomeEmbed] });
      }
    } catch (error) {
      await Logger.log(client, guild.id, {
        titleKey: 'dm_failed',
        descData: { username: botAddLog?.executor?.tag || 'Unknown User' },
        color: '#ff0000',
        fields: [
          { nameKey: 'user_label', value: botAddLog?.executor?.tag || 'Unknown User' },
          { nameKey: 'user_id', value: botAddLog?.executor?.id || 'Unknown ID' },
          { nameKey: 'error_label', value: error.message }
        ]
      });
    }
    
    // Update settings
    await updateGuildSettings(client);
  },
}).toJSON();
