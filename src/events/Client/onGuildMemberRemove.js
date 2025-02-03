const Event = require('../../Structures/Event');
const { error } = require('../../utils/Console');
const Logger = require('../../utils/Logger');

module.exports = new Event({
    event: "guildMemberRemove",
    run: async (client, member) => {
        // remove the member from the leveling system for the specific guild
        const levelingProgress = await client.database_handler.findOne('levelingProgress', { guild: member.guild.id, userId: member.id });
        if (!levelingProgress) return;

        try {
            await client.database_handler.deleteOne('levelingProgress', { guild: member.guild.id, userId: member.id });
            // log the removal onn the dev logger
            Logger.log(client, member.guild.id, {
                titleKey: 'leveling_progress_removed',
                descData: {
                    userId: member.id,
                    username: member.user.username
                }
            })
        } catch (err) {
            error('Error removing leveling progress:', err);
            throw err;
        }
    }
})