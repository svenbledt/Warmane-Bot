const Event = require('../../Structures/Event');
const LevelingSystemHandler = require('../../client/handler/LevelingSystemHandler');

module.exports = new Event({
    event: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot) return;
        
        // Check if the message is in a guild
        if (!message.guild) return;

        // Check if the message is in a text channel
        if (message.channel.type !== "text") return;

        const levelingSystem = new LevelingSystemHandler(client);
        // implementing the leveling system for messages
        const guild = message.guild;
        const member = message.member;

        const guildSettings = await client.database_handler.findOne('settings', { guild: guild.id });
        if (!guildSettings?.levelingSystem) return;

        // add a cooldown how often the user gets xp for messages
        const cooldown = 1000 * 60 * 5; // 5 minutes
        const lastMessageTime = member.lastMessageTime || 0;
        if (Date.now() - lastMessageTime < cooldown) return;

        await levelingSystem.addMessage(guild.id, member.id);
        
    }
})