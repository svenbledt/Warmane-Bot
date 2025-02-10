const { EmbedBuilder } = require('discord.js');
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
    
            // Then proceed with normal guild logging
            const guildSettings = await client.getDatabaseHandler().findOne('settings', {
                guild: guildId
            });
    
            if (!guildSettings?.enableLogging || !guildSettings?.logChannel) return;
    
            const lang = guildSettings.language || 'en';
            
            let channel;
            try {
                channel = await client.channels.fetch(guildSettings.logChannel);
            } catch (error) {
                // If channel doesn't exist, update database to remove invalid channel
                if (error.code === 10003) {
                    await client.getDatabaseHandler().updateOne('settings', 
                        { guild: guildId },
                        { $set: { logChannel: '' } }
                    );
                }
                console.error(`Failed to fetch log channel for guild ${guildId}: ${error.message}`);
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

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error in Logger:', error);
        }
    }
}

module.exports = Logger; 