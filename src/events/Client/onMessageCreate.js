const Event = require("../../structure/Event");
const LevelingSystemHandler = require('../../client/handler/LevelingSystemHandler');
const LanguageManager = require("../../utils/LanguageManager");
const { ChannelType } = require('discord.js');

module.exports = new Event({
    event: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot || !message.guild || message.channel.type !== ChannelType.GuildText) return;

        const levelingSystem = new LevelingSystemHandler(client);
        const guild = message.guild;
        const member = message.member;

        const guildSettings = await client.database_handler.findOne('settings', { guild: guild.id });
        if (!guildSettings?.levelingSystem) return;

        // Check cooldown
        const cooldown = 1000 * 60 * 5; // 5 minutes
        const lastMessageTime = member.lastMessageTime || 0;
        if (Date.now() - lastMessageTime < cooldown) return;

        // Get current level before adding message XP
        const levelingProgress = await client.database_handler.findOne('levelingProgress', { 
            guild: guild.id, 
            userId: member.user.id  // Using member.user.id to ensure we get the correct user ID
        });
        const oldLevel = levelingProgress?.level || 0;

        // Add message XP
        await levelingSystem.addMessage(guild.id, member.user.id);

        // Check for level up
        if (guildSettings.levelingChannel) {
            const newLevelingProgress = await client.database_handler.findOne('levelingProgress', { 
                guild: guild.id, 
                userId: member.user.id 
            });
            
            if (newLevelingProgress && newLevelingProgress.level > oldLevel) {
                const levelingChannel = client.channels.cache.get(guildSettings.levelingChannel);
                if (levelingChannel) {
                    const displayName = member.nickname || member.user.globalName || member.user.username;
                    await levelingChannel.send(LanguageManager.getText('level.level_up', guildSettings.language, {
                        level: newLevelingProgress.level,
                        user: displayName
                    }));
                }
            }
        }
    }
});