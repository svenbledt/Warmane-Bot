const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");
const Logger = require("../../utils/Logger");
const { EmbedBuilder, AuditLogEvent } = require('discord.js');

async function ensureGuildSettings(guildSettings) {
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
  // Get all current guild IDs from the client
  const currentGuildIds = new Set(client.guilds.cache.keys());
  
  // Get all settings documents
  const settings = await client.database_handler.find('settings', {
    guild: { $in: Array.from(currentGuildIds) }
  });

  // Create a map of existing settings for faster lookup
  const existingSettings = new Map(settings.map(setting => [setting.guild, setting]));

  // Process each guild
  for (const guildId of currentGuildIds) {
    let guildSettings = existingSettings.get(guildId);
    const guildName = client.guilds.cache.get(guildId).name;

    if (!guildSettings) {
      // Create new settings if none exist
      guildSettings = {
        guild: guildId,
        guildName: guildName,
      };
      
      // Ensure default settings
      await ensureGuildSettings(guildSettings);
      
      // Create new document
      await client.database_handler.create('settings', guildSettings);
    } else {
      // Update existing settings if needed
      if (guildSettings.guildName !== guildName) {
        guildSettings.guildName = guildName;
        await client.database_handler.updateOne('settings', 
          { guild: guildId },
          { guildName: guildName }
        );
      }

      // Check and update default settings
      if (await ensureGuildSettings(guildSettings)) {
        await client.database_handler.updateOne('settings',
          { guild: guildId },
          guildSettings
        );
      }
    }
  }
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
    let botAddLog = null;
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
        titleKey: 'dm',
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
});
