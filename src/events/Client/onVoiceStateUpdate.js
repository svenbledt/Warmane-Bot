const Event = require("../../structure/Event");
const { Collection } = require('discord.js');
const LevelingSystemHandler = require('../../client/handler/LevelingSystemHandler');

// Store voice session data outside the event to persist between calls
const voiceSessionsMap = new Collection();

module.exports = new Event({
  event: "voiceStateUpdate",
  once: false,
  run: async (client, oldState, newState) => {
    const userId = oldState.id || newState.id;
    const levelingSystem = new LevelingSystemHandler(client);

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
    
    // User leaves a voice channel
    if (oldState.channelId && !newState.channelId) {
      const sessionData = voiceSessionsMap.get(userId);
      if (sessionData) {
        const oldGuildSettings = await client.database_handler.findOne('settings', { guild: sessionData.guildId });
        if (oldGuildSettings?.levelingSystem) {
          const duration = Date.now() - sessionData.startTime;
          await levelingSystem.addVoiceTime(
            sessionData.guildId,
            userId,
            duration
          );
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
          await levelingSystem.addVoiceTime(
            oldSessionData.guildId,
            userId,
            duration
          );
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
  }
});