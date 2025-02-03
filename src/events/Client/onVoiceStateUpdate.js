const Event = require("../../structure/Event");
const { Collection } = require('discord.js');
const LevelingSystemHandler = require('../../client/handler/LevelingSystemHandler');
const LanguageManager = require("../../utils/LanguageManager");

// Store voice session data outside the event to persist between calls
const voiceSessionsMap = new Collection();

module.exports = new Event({
  event: "voiceStateUpdate",
  once: false,
  run: async (client, oldState, newState) => {
    const userId = oldState.id || newState.id;
    const levelingSystem = new LevelingSystemHandler(client);

    // Helper function to handle level up messages
    async function handleLevelUp(guildId, userId, oldLevel) {
      const guildSettings = await client.database_handler.findOne('settings', { guild: guildId });
      const levelingProgress = await client.database_handler.findOne('levelingProgress', { guild: guildId, userId: userId });
      
      if (levelingProgress && guildSettings?.levelingChannel && levelingProgress.level > oldLevel) {
        const levelingChannel = client.channels.cache.get(guildSettings.levelingChannel);
        if (levelingChannel) {
          const member = await client.guilds.cache.get(guildId)?.members.fetch(userId);
          const displayName = member?.displayName || member?.user.username;
          
          await levelingChannel.send(LanguageManager.getText('level.level_up', guildSettings.language, {
            level: levelingProgress.level,
            user: displayName
          }));
        }
      }
    }

    // Helper function to process voice time and XP
    async function processVoiceSession(sessionData) {
      if (!sessionData) return;
      
      const duration = Date.now() - sessionData.startTime;
      
      // Always process account standing XP regardless of guild settings
      await levelingSystem.addVoiceTimeAccount(userId, duration);

      // Process guild-specific XP only if leveling is enabled
      const guildSettings = await client.database_handler.findOne('settings', { guild: sessionData.guildId });
      if (guildSettings?.levelingSystem) {
        const oldLevelData = await client.database_handler.findOne('levelingProgress', { 
          guild: sessionData.guildId, 
          userId: userId 
        });
        const oldLevel = oldLevelData?.level || 0;

        await levelingSystem.addVoiceTimeGuild(sessionData.guildId, userId, duration);
        await handleLevelUp(sessionData.guildId, userId, oldLevel);
      }
    }

    // User leaves a voice channel
    if (oldState.channelId && !newState.channelId) {
      const sessionData = voiceSessionsMap.get(userId);
      if (sessionData) {
        await processVoiceSession(sessionData);
        voiceSessionsMap.delete(userId);
      }
    }
    
    // User switches channels (including guild switches)
    if (oldState.channelId && newState.channelId && 
      (oldState.channelId !== newState.channelId || oldState.guild.id !== newState.guild.id)) {
      
      // Process old session
      const oldSessionData = voiceSessionsMap.get(userId);
      if (oldSessionData) {
        await processVoiceSession(oldSessionData);
        voiceSessionsMap.delete(userId);
      }

      // Start new session
      voiceSessionsMap.set(userId, {
        startTime: Date.now(),
        channelId: newState.channelId,
        guildId: newState.guild.id
      });
    }

    // User joins a voice channel
    if (!oldState.channelId && newState.channelId) {
      voiceSessionsMap.set(userId, {
        startTime: Date.now(),
        channelId: newState.channelId,
        guildId: newState.guild.id
      });
    }
  }
});