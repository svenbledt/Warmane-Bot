const { success } = require('../../utils/Console');
const Event = require('../../structure/Event');
const config = require('../../config');
const Logger = require('../../utils/Logger');
const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = new Event({
    event: 'guildCreate',
    once: false,
    run: async (client, guild) => {
        const announcementChannel = client.channels.cache.get(
            config.development.announcementChannel
        );

        // Ensure guild settings when bot joins new guild
        await client.getDatabaseHandler().ensureGuildSettings(guild.id, guild.name);

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
                    .setColor('#261b0d')
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
                    { nameKey: 'dm.user_label', value: botAddLog?.executor?.tag || 'Unknown User' },
                    { nameKey: 'dm.user_id', value: botAddLog?.executor?.id || 'Unknown ID' },
                    { nameKey: 'error_label', value: error.message }
                ]
            });
        }
    },
});
