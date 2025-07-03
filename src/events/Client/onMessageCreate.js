const Event = require('../../structure/Event');
const LanguageManager = require('../../utils/LanguageManager');
const { ChannelType, EmbedBuilder } = require('discord.js');
const WordContextAnalyzer = require('../../utils/WordContextAnalyzer');

module.exports = new Event({
    event: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot || !message.guild || message.channel.type !== ChannelType.GuildText) return;

        // Blacklisted words checking function
        async function checkBlacklistedWords(client, message) {
            try {
                // Get guild settings
                const guildSettings = await client.getDatabaseHandler().findOne('settings', { guild: message.guild.id });
                
                // Get global words first (always enforced regardless of server settings)
                const globalWords = await client.getDatabaseHandler().find('blacklistedWords', {
                    enabled: true,
                    global: true
                });

                // Get server-specific words only if the feature is enabled
                let serverWords = [];
                if (guildSettings && guildSettings.blacklistWords) {
                    serverWords = await client.getDatabaseHandler().find('blacklistedWords', {
                        guild: message.guild.id,
                        enabled: true,
                        global: false
                    });
                }

                const blacklistedWords = [...globalWords, ...serverWords];

                if (blacklistedWords.length === 0) return;

                const messageContent = message.content;
                const messageWords = messageContent.toLowerCase().split(/\s+/);
                let foundWords = [];
                let shouldDelete = false;
                let shouldWarn = false;
                const contextAnalyzer = new WordContextAnalyzer();

                // Check each blacklisted word
                for (const wordData of blacklistedWords) {
                    const wordToCheck = wordData.caseSensitive ? wordData.word : wordData.word.toLowerCase();
                    
                    // Check if the word is in the message
                    let wordFound = false;
                    if (wordData.caseSensitive) {
                        wordFound = messageContent.includes(wordToCheck);
                    } else {
                        // Case insensitive check
                        wordFound = messageWords.some(word => word.includes(wordToCheck));
                    }

                    if (wordFound) {
                        // If context analysis is enabled, analyze the usage
                        if (wordData.useContextAnalysis) {
                            const analysis = contextAnalyzer.analyzeContext(messageContent, wordData.word, wordData);
                            
                            // Only flag as inappropriate if confidence is below threshold
                            if (analysis.confidence < wordData.contextThreshold) {
                                foundWords.push({
                                    ...wordData,
                                    contextAnalysis: analysis
                                });
                                if (wordData.deleteMessage) shouldDelete = true;
                                if (wordData.warnUser) shouldWarn = true;
                            } else {
                                // Log that context analysis prevented action
                                console.log(`Context analysis prevented action for word "${wordData.word}" in message: "${messageContent.substring(0, 100)}..." (confidence: ${analysis.confidence.toFixed(2)})`);
                            }
                        } else {
                            // No context analysis, treat as inappropriate
                            foundWords.push(wordData);
                            if (wordData.deleteMessage) shouldDelete = true;
                            if (wordData.warnUser) shouldWarn = true;
                        }
                    }
                }

                if (foundWords.length === 0) return;

                // Delete message if any word requires it
                if (shouldDelete) {
                    try {
                        await message.delete();
                    } catch (error) {
                        console.error('Failed to delete message with blacklisted word:', error);
                    }
                }

                // Warn user if any word requires it
                if (shouldWarn) {
                    try {
                        const warningEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle(LanguageManager.getText('events.blacklisted_word.title', guildSettings.language))
                            .setDescription(LanguageManager.getText('events.blacklisted_word.description', guildSettings.language, {
                                username: message.author.username,
                                words: foundWords.map(w => w.word).join(', ')
                            }))
                            .addFields(
                                { name: LanguageManager.getText('events.blacklisted_word.fields.channel', guildSettings.language), value: message.channel.name, inline: true },
                                { name: LanguageManager.getText('events.blacklisted_word.fields.message_id', guildSettings.language), value: message.id, inline: true }
                            )
                            .setTimestamp();

                        // Add context analysis information if available
                        const wordsWithContext = foundWords.filter(w => w.contextAnalysis);
                        if (wordsWithContext.length > 0) {
                            const contextInfo = wordsWithContext.map(w => 
                                `**${w.word}**: ${w.contextAnalysis.reasoning.slice(0, 2).join(', ')}`
                            ).join('\n');
                            
                            warningEmbed.addFields({
                                name: LanguageManager.getText('events.blacklisted_word.fields.context_analysis', guildSettings.language),
                                value: contextInfo,
                                inline: false
                            });
                        }

                        // Send warning to the channel
                        await message.channel.send({
                            content: `${message.author}`,
                            embeds: [warningEmbed]
                        });
                    } catch (error) {
                        console.error('Failed to send blacklisted word warning:', error);
                    }
                }

                // Log the incident if logging is enabled
                if (guildSettings.enableLogging && guildSettings.logChannel) {
                    try {
                        const logChannel = client.channels.cache.get(guildSettings.logChannel);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setColor(0xff0000)
                                .setTitle(LanguageManager.getText('logging.blacklisted_word_used.title', guildSettings.language))
                                .setDescription(LanguageManager.getText('logging.blacklisted_word_used.description', guildSettings.language, {
                                    username: message.author.username,
                                    words: foundWords.map(w => w.word).join(', ')
                                }))
                                .addFields(
                                    { name: LanguageManager.getText('logging.blacklisted_word_used.fields.user', guildSettings.language), value: `${message.author.username} (${message.author.id})`, inline: true },
                                    { name: LanguageManager.getText('logging.blacklisted_word_used.fields.channel', guildSettings.language), value: message.channel.name, inline: true },
                                    { name: LanguageManager.getText('logging.blacklisted_word_used.fields.message_id', guildSettings.language), value: message.id, inline: true },
                                    { name: LanguageManager.getText('logging.blacklisted_word_used.fields.action_taken', guildSettings.language), value: `${shouldDelete ? '🗑️' : ''} ${shouldWarn ? '⚠️' : ''}`.trim() || LanguageManager.getText('logging.blacklisted_word_used.no_action', guildSettings.language) }
                                )
                                .setTimestamp();

                            if (message.content.length > 0) {
                                logEmbed.addFields({
                                    name: LanguageManager.getText('logging.blacklisted_word_used.fields.message_content', guildSettings.language),
                                    value: message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content
                                });
                            }

                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    } catch (error) {
                        console.error('Failed to log blacklisted word usage:', error);
                    }
                }

            } catch (error) {
                console.error('Error checking blacklisted words:', error);
            }
        }

        // Check for blacklisted words first
        await checkBlacklistedWords(client, message);

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