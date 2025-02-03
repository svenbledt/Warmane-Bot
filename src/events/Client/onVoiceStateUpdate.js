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

    // User leaves a voice channel
    if (oldState.channelId && !newState.channelId) {
      const sessionData = voiceSessionsMap.get(userId);
      if (sessionData) {
        const oldGuildSettings = await client.database_handler.findOne('settings', { guild: sessionData.guildId });
        if (oldGuildSettings?.levelingSystem) {
          const duration = Date.now() - sessionData.startTime;
          
          // Get current level before adding voice time
          const oldLevelData = await client.database_handler.findOne('levelingProgress', { 
            guild: sessionData.guildId, 
            userId: userId 
          });
          const oldLevel = oldLevelData?.level || 0;

          // Add voice time and check for level up
          await levelingSystem.addVoiceTime(
            sessionData.guildId,
            userId,
            duration
          );

          // Handle level up message
          await handleLevelUp(sessionData.guildId, userId, oldLevel);
        }
        voiceSessionsMap.delete(userId);
      }
    }
    
    // User switches channels (including guild switches)
    if (oldState.channelId && newState.channelId && 
      (oldState.channelId !== newState.channelId || oldState.guild.id !== newState.guild.id)) {
      
      // Process old session
      const oldSessionData = voiceSessionsMap.get(userId);
      if (oldSessionData) {
        const oldGuildSettings = await client.database_handler.findOne('settings', { guild: oldSessionData.guildId });
        if (oldGuildSettings?.levelingSystem) {
          const duration = Date.now() - oldSessionData.startTime;

          // Get current level before adding voice time
          const oldLevelData = await client.database_handler.findOne('levelingProgress', { 
            guild: oldSessionData.guildId, 
            userId: userId 
          });
          const oldLevel = oldLevelData?.level || 0;

          // Add voice time and check for level up
          await levelingSystem.addVoiceTime(
            oldSessionData.guildId,
            userId,
            duration
          );

          // Handle level up message
          await handleLevelUp(oldSessionData.guildId, userId, oldLevel);
        }
        voiceSessionsMap.delete(userId);
      }

      // Start new session if leveling is enabled in new guild
      const newGuildSettings = await client.database_handler.findOne('settings', { guild: newState.guild.id });
      if (newGuildSettings?.levelingSystem) {
        voiceSessionsMap.set(userId, {
          startTime: Date.now(),
          channelId: newState.channelId,
          guildId: newState.guild.id
        });
      }
    }

    // User joins a voice channel
    if (!oldState.channelId && newState.channelId) {
      const newGuildSettings = await client.database_handler.findOne('settings', { guild: newState.guild.id });
      if (newGuildSettings?.levelingSystem) {
        voiceSessionsMap.set(userId, {
          startTime: Date.now(),
          channelId: newState.channelId,
          guildId: newState.guild.id
        });
      }
    }
  }
});