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
            const guildSettings = await client.database_handler.findOne('settings', {
                guild: guildId
            });

            if (!guildSettings?.enableLogging || !guildSettings?.logChannel) return;

            const lang = guildSettings.language || 'en';
            const channel = await client.channels.fetch(guildSettings.logChannel);
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
            console.error('Logging failed:', error);
        }
    }
}

module.exports = Logger; 