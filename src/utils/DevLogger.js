const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const LanguageManager = require('../utils/LanguageManager');

class DevLogger {
    /**
     * Log an event to the development server's log channel
     * @param {Object} client - The Discord client
     * @param {String} guildId - The ID of the guild where the event happened
     * @param {Object} options - Logging options
     * @returns {Promise<void>}
     */
    static async log(client, guildId, options) {
        try {
            // Check if we have the development configuration
            if (!config.development?.guildId || !config.development?.logChannel) {
                return;
            }

            // Get the development server and log channel
            const devGuild = await this.#getDevGuild(client);
            if (!devGuild) return;

            const devLogChannel = await this.#getDevLogChannel(client);
            if (!devLogChannel) return;

            // Get the guild where the action occurred
            const actionGuild = await this.#getActionGuild(client, guildId);
            if (!actionGuild) return;

            // Create and send the embed
            const embed = this.#createEmbed(options, actionGuild);
            await this.#sendEmbed(devLogChannel, embed);
        } catch (error) {
            console.error('[DevLogger] Development logging failed:', error);
        }
    }

    /**
     * Get the development guild
     */
    static async #getDevGuild(client) {
        try {
            return client.guilds.cache.get(config.development.guildId);
        } catch (error) {
            console.error('[DevLogger] Failed to get development guild:', error);
            return null;
        }
    }

    /**
     * Get the development log channel
     */
    static async #getDevLogChannel(client) {
        try {
            return client.channels.cache.get(config.development.logChannel);
        } catch (error) {
            console.error('[DevLogger] Failed to get development log channel:', error);
            return null;
        }
    }

    /**
     * Get the guild where the action occurred
     */
    static async #getActionGuild(client, guildId) {
        try {
            return client.guilds.cache.get(guildId);
        } catch (error) {
            console.error(`[DevLogger] Failed to get action guild ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Create the embed for the log message
     */
    static #createEmbed(options, actionGuild) {
        const embed = new EmbedBuilder()
            .setColor(options.color || '#0099ff')
            .setTitle(`${options.title || LanguageManager.getText('logging.log_event', 'en')} | ${actionGuild.name}`)
            .setDescription(options.description || LanguageManager.getText('logging.no_value_provided', 'en'))
            .setTimestamp();

        // Add server information field
        embed.addFields({
            name: LanguageManager.getText('logging.server_information', 'en'),
            value: `Name: ${actionGuild.name}\nID: ${actionGuild.id}\nMembers: ${actionGuild.memberCount}`,
            inline: false
        });

        // Add additional fields if they exist
        if (options.fields && Array.isArray(options.fields)) {
            const formattedFields = options.fields.map(field => ({
                name: field.nameKey ? 
                    LanguageManager.getText(`logging.${field.nameKey}`, 'en', field.nameData) : 
                    field.name || LanguageManager.getText('logging.information', 'en'),
                value: field.value || LanguageManager.getText('logging.no_value_provided', 'en'),
                inline: field.inline || false
            }));
            embed.addFields(formattedFields);
        }

        embed.setFooter({ 
            text: `${LanguageManager.getText('logging.development_logs', 'en')} | ${actionGuild.name}`, 
            iconURL: actionGuild.client.user.displayAvatarURL() 
        });

        return embed;
    }

    /**
     * Send the embed to the development log channel
     */
    static async #sendEmbed(channel, embed) {
        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('[DevLogger] Error sending development log:', error);
        }
    }
}

module.exports = DevLogger; 