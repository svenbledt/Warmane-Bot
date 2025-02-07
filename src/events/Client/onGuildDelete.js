const { success } = require('../../utils/Console');
const Event = require('../../structure/Event');
const config = require('../../config');

module.exports = new Event({
    event: 'guildDelete',
    once: false,
    run: async (client, guild) => {
        try {
            // Remove guild settings
            await client.getDatabaseHandler().deleteOne('settings', { guild: guild.id });

            success(
                `Guild ${guild.name} (${guild.id}) has been removed from the database.`
            );

            // Send announcement if channel exists
            const announcementChannel = client.channels.cache.get(
                config.development.announcementChannel
            );
      
            if (announcementChannel) {
                await announcementChannel.send({
                    content: `**${guild.name} (${guild.id}) has left the Project!**`,
                });
            }
        } catch (error) {
            console.error('Error handling guild deletion for guild:', guild.name, '(', guild.id, '):', error);
        }
    },
});
