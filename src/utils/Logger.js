const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const LanguageManager = require('./LanguageManager');
const DevLogger = require('./DevLogger');

class Logger {
    static async log(client, guildId, options) {
        try {
            // Skip sending invite creation logs to dev logger
            if (options.titleKey !== 'invite_created') {
                await DevLogger.log(client, guildId, {
                    title: options.titleKey ? 
                        LanguageManager.getText(`logging.${options.titleKey}.title`, 'en', options.titleData) : 
                        'Log Event',
                    description: options.descData ? 
                        LanguageManager.getText(`logging.${options.titleKey}.description`, 'en', options.descData) :
                        options.description,
                    color: options.color,
                    fields: options.fields
                });
            }
    
            const guildSettings = await client.getDatabaseHandler().findOne('settings', {
                guild: guildId
            });
    
            if (!guildSettings?.enableLogging || !guildSettings?.logChannel) return;
    
            const lang = guildSettings.language || 'en';
            
            let channel;
            try {
                channel = await client.channels.fetch(guildSettings.logChannel);
                
                // Check bot permissions in the channel - Updated permission check
                const requiredPermissions = [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.EmbedLinks
                ];
                
                const permissions = channel.permissionsFor(client.user);
                const missingPermissions = requiredPermissions.filter(perm => !permissions.has(perm));
                
                if (missingPermissions.length > 0) {
                    console.warn(`Missing required permissions in log channel for guild ${guildId}`);
                    
                    // Try to notify guild owner
                    try {
                        const guild = await client.guilds.fetch(guildId);
                        const owner = await guild.fetchOwner();
                        await owner.send({
                            content: 'I don\'t have the required permissions to send logs in the configured log channel. Please ensure I have the following permissions: View Channel, Send Messages, and Embed Links.'
                        });
                    } catch (error) {
                        console.warn(`Could not notify guild owner about missing permissions in ${guildId}: ${error.message}`);
                    }
                    return;
                }
            } catch (error) {
                // Handle channel fetch errors
                if (error.code === 10003) {
                    await client.getDatabaseHandler().updateOne('settings', 
                        { guild: guildId },
                        { $set: { logChannel: '' } }
                    );
                    console.warn(`Invalid log channel removed for guild ${guildId}`);
                } else if (error.code === 50001) {
                    console.warn(`Missing access to log channel in guild ${guildId}`);
                } else {
                    console.error(`Failed to fetch log channel for guild ${guildId}: ${error.message}`);
                }
                return;
            }
    
            if (!channel) return;
    
            const embed = new EmbedBuilder()
                .setColor(options.color || '#0099ff')
                .setTitle(LanguageManager.getText(`logging.${options.titleKey}.title`, lang, options.titleData))
                .setDescription(LanguageManager.getText(`logging.${options.titleKey}.description`, lang, options.descData))
                .setTimestamp();

            if (options.fields && Array.isArray(options.fields)) {
                const formattedFields = options.fields.map(field => ({
                    name: field.nameKey ? 
                        LanguageManager.getText(`logging.${field.nameKey}`, lang, field.nameData) : 
                        field.name || 'Information',
                    value: field.value || 'No value provided',
                    inline: field.inline || false
                }));
                embed.addFields(formattedFields);
            }

            embed.setFooter({ 
                text: LanguageManager.getText('logging.footer', lang), 
                iconURL: client.user.displayAvatarURL() 
            });

            try {
                await channel.send({ embeds: [embed] });
            } catch (error) {
                if (error.code === 50001) {
                    console.warn(`Missing permissions to send messages in log channel for guild ${guildId}`);
                } else {
                    console.error(`Error sending log message to guild ${guildId}:`, error.message);
                }
            }
        } catch (error) {
            console.error('Error in Logger:', error);
        }
    }
}

module.exports = Logger; 