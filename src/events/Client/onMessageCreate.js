const Event = require('../../structure/Event');
const LanguageManager = require('../../utils/LanguageManager');
const { ChannelType } = require('discord.js');

module.exports = new Event({
    event: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot || !message.guild || message.channel.type !== ChannelType.GuildText) return;

        const levelingSystem = client.getLevelingSystemHandler();
        const member = message.member;
        const userId = member.user.id;
        const guildId = message.guild.id;

        // Check cooldown
        const cooldown = 1000 * 60 * 5; // 5 minutes
        const lastMessageTime = member.lastMessageTime || 0;
        if (Date.now() - lastMessageTime < cooldown) return;

        // Always process account standing XP regardless of guild settings
        await levelingSystem.addMessageAccount(userId);

        // Process guild-specific XP only if leveling is enabled
        const guildSettings = await client.getDatabaseHandler().findOne('settings', { guild: guildId });
        if (!guildSettings?.levelingSystem) return;

        // Get current level before adding XP
        const levelingProgress = await client.getDatabaseHandler().findOne('levelingProgress', { 
            guild: guildId, 
            userId: userId
        });
        const oldLevel = levelingProgress?.level || 0;

        // Add message XP and check for level up
        await levelingSystem.addMessageGuild(guildId, userId);

        // Send level up message if channel is configured
        if (guildSettings.levelingChannel) {
            const newLevelingProgress = await client.getDatabaseHandler().findOne('levelingProgress', { 
                guild: guildId, 
                userId: userId 
            });
            
            if (newLevelingProgress?.level > oldLevel) {
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