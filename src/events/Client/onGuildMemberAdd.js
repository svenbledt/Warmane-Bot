const Event = require('../../structure/Event');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const Logger = require('../../utils/Logger');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const TIMEOUT_DURATION = 600000; // 10 minutes
const MAX_CHAR_LENGTH = 16;

// Define an axios instance with rate limit
const https = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 4000,
});

// Add realm constants
const REALMS = [
    { name: 'Lordaeron', value: 'Lordaeron' },
    { name: 'Frostmourne', value: 'Frostmourne' },
    { name: 'Icecrown', value: 'Icecrown' },
    { name: 'Blackrock', value: 'Blackrock' }
];

// Function to check specific realm (for database characters)
async function checkSpecificRealm(charName, realm) {
    try {
        const response = await https.get(
            `${config.users.url}/api/character/${charName}/${realm}/summary`
        );
        const exists = response.data && response.data.name;
        return exists;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

// Function to check all realms (for manual input)
async function checkAllRealms(charName) {
    for (const realm of REALMS) {
        const exists = await checkSpecificRealm(charName, realm.value);
        if (exists) {
            return { found: true, realm: realm.value };
        }
    }
    return { found: false };
}

// Add this helper function at the top with other helpers
function formatCharacterName(name) {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Update handleManualInput function
async function handleManualInput(client, member, dmChannel, guildSettings, lang) {
    const isDevServer = member.guild.id === config.development.guildId;
  
    await dmChannel.send(guildSettings.charNameAskDM);
  
    const filter = (m) => m.author.id === member.user.id;
    const collector = dmChannel.createMessageCollector({
        filter,
        time: TIMEOUT_DURATION,
    });

    collector.on('collect', async (collected) => {
        const isMemberPresent = await member.guild.members.fetch(member.id).catch(() => null);
        if (!isMemberPresent) {
            collector.stop('member-left');
            return;
        }

        let response = collected.content.trim().replace(/[^a-zA-Z ]/g, '');
    
        if (!response || response.length > MAX_CHAR_LENGTH) {
            await dmChannel.send(
                LanguageManager.getText('events.guildMemberAdd.invalid_response', lang)
            );
            return;
        }

        response = formatCharacterName(response);

        if (!isDevServer) {
            // Check if character exists in database
            const userCharacter = await client.getDatabaseHandler().findOne('userCharacters', {
                $or: [
                    { 'main.name': { $regex: new RegExp(`^${response}$`, 'i') } },
                    { 'alts': { 
                        $elemMatch: { 
                            'name': { $regex: new RegExp(`^${response}$`, 'i') }
                        }
                    }}
                ]
            });

            if (userCharacter) {
                const existingCharacter = userCharacter.main?.name.toLowerCase() === response.toLowerCase()
                    ? { ...userCharacter.main, isMain: true, ownerId: userCharacter._id }
                    : { 
                        ...userCharacter.alts.find(alt => 
                            alt.name.toLowerCase() === response.toLowerCase()
                        ),
                        isAlt: true,
                        ownerId: userCharacter._id
                    };

                // Character exists in database, check specific realm
                const exists = await checkSpecificRealm(response, existingCharacter.realm);
                if (!exists) {
                    await dmChannel.send(
                        LanguageManager.getText('events.guildMemberAdd.character_not_found', lang)
                    );
                    return;
                }

                if (existingCharacter.ownerId === member.user.id) {
                    await dmChannel.send(
                        LanguageManager.getText('events.guildMemberAdd.already_your_character', lang)
                    );
                    return;
                }
            } else {
                // New character, check all realms
                const result = await checkAllRealms(response);
                if (!result.found) {
                    await dmChannel.send(
                        LanguageManager.getText('events.guildMemberAdd.character_not_found', lang)
                    );
                    return;
                }

                // Store new character in database
                const characterData = {
                    name: response,
                    realm: result.realm,
                    addedBy: member.user.id,
                    addedAt: new Date()
                };

                await client.getDatabaseHandler().updateOne('userCharacters',
                    { userId: member.user.id },
                    {
                        $setOnInsert: { userId: member.user.id },
                        $set: { main: characterData }
                    },
                    { upsert: true }
                );
            }
        }

        const message = await handleNicknameChange(client, member, response, lang, member.guild.name);
        await dmChannel.send(message);
        collector.stop('valid-response');

        // Check member presence again before sending welcome message
        const isMemberStillPresent = await member.guild.members.fetch(member.id).catch(() => null);
        if (isMemberStillPresent && guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
            await handleWelcomeMessage(client, member, guildSettings);
        }
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'member-left') {
            await Logger.log(client, member.guild.id, {
                titleKey: 'member_left_during_dm',
                descData: { username: member.user.tag },
                color: '#ff0000',
                fields: [
                    { 
                        nameKey: 'dm.user_label', 
                        nameData: {}, 
                        value: member.user.tag 
                    },
                    { 
                        nameKey: 'dm.user_id', 
                        nameData: {}, 
                        value: member.user.id 
                    }
                ]
            });
            return;
        }

        if (reason !== 'valid-response' && member.dmChannel) {
            try {
                await member.send(
                    LanguageManager.getText('commands.charname.dm_timeout_message', lang, {
                        guildName: member.guild.name
                    })
                );
                await Logger.log(client, member.guild.id, {
                    titleKey: 'dm_timeout',
                    descData: { username: member.user.tag },
                    color: '#ff0000',
                    fields: [
                        { 
                            nameKey: 'dm.user_label', 
                            nameData: {}, 
                            value: member.user.tag 
                        },
                        { 
                            nameKey: 'dm.user_id', 
                            nameData: {}, 
                            value: member.user.id 
                        }
                    ]
                });

                // Check member presence before sending welcome message on timeout
                const isMemberPresent = await member.guild.members.fetch(member.id).catch(() => null);
                if (isMemberPresent && guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                    await handleWelcomeMessage(client, member, guildSettings);
                }
            } catch (error) {
                console.error(`Failed to send timeout message to ${member.user.tag}:`, error);
            }
        }
    });
}

// Update handleNicknameChange function
async function handleNicknameChange(client, member, charName, lang, guildName) {
    // Get fresh database content from client.getDatabaseHandler() instead of direct database access
    const userChars = await client.getDatabaseHandler().findMany('userCharacters') || {};
  
    const validation = await validateCharacterName(client, charName, userChars, lang);
    if (!validation.valid) {
        return validation.message;
    }

    try {
        await member.setNickname(charName);
    
        await Logger.log(client, member.guild.id, {
            titleKey: 'nickname_changed',
            descData: { 
                username: member.user.tag, 
                nickname: charName 
            },
            color: '#00ff00',
            fields: [
                { 
                    nameKey: 'dm.user_label', 
                    value: member.user.tag 
                },
                { 
                    nameKey: 'dm.user_id', 
                    value: member.user.id 
                },
                { 
                    nameKey: 'nickname_changed.new_nickname',
                    value: charName 
                }
            ]
        });
    
        return LanguageManager.getText('events.guildMemberAdd.name_changed', lang, {
            nickname: charName,
            guildName: guildName
        });
    } catch (error) {
        console.error(`Failed to change nickname: ${error.message}`);
        return LanguageManager.getText('events.guildMemberAdd.name_change_failed', lang, {
            error: error.message
        });
    }
}

// Update handleDevServer to include all logging points
async function handleDevServer(client, member, guildSettings, lang) {
    if (!guildSettings.CharNameAsk) return;

    try {
        const dmChannel = await member.createDM();
        await dmChannel.send(guildSettings.charNameAskDM);
    
        // Log DM sent
        await Logger.log(client, member.guild.id, {
            titleKey: 'dm_sent',
            descData: { username: member.user.tag },
            color: '#00ff00',
            fields: [
                { 
                    nameKey: 'dm.user_label', 
                    nameData: {}, 
                    value: member.user.tag 
                },
                { 
                    nameKey: 'dm.user_id', 
                    nameData: {}, 
                    value: member.user.id 
                }
            ]
        });
    
        const filter = (m) => m.author.id === member.user.id;
        const collector = dmChannel.createMessageCollector({
            filter,
            time: TIMEOUT_DURATION,
        });

        collector.on('collect', async (collected) => {
            let response = collected.content.trim().replace(/[^a-zA-Z ]/g, '');
      
            if (!response || response.length > MAX_CHAR_LENGTH) {
                await dmChannel.send(
                    LanguageManager.getText('events.guildMemberAdd.invalid_response', lang)
                );
        
                // Log invalid response
                await Logger.log(client, member.guild.id, {
                    titleKey: 'invalid_response',
                    descData: { username: member.user.tag },
                    color: '#ff9900',
                    fields: [
                        { 
                            nameKey: 'dm.user_label', 
                            nameData: {}, 
                            value: member.user.tag 
                        },
                        { 
                            nameKey: 'dm.user_id', 
                            nameData: {}, 
                            value: member.user.id 
                        },
                        { 
                            nameKey: 'dm.response', 
                            nameData: {}, 
                            value: response || 'empty' 
                        }
                    ]
                });
                return;
            }

            // Format the character name
            response = formatCharacterName(response);

            const message = await handleNicknameChange(client, member, response, lang, member.guild.name);
            await dmChannel.send(message);
            collector.stop('valid-response');

            // Send welcome message after nickname is set
            if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                await handleWelcomeMessage(client, member, guildSettings);
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason !== 'valid-response') {
                try {
                    if (member.dmChannel) {
                        await member.send(
                            LanguageManager.getText('commands.charname.dm_timeout_message', lang, {
                                guildName: member.guild.name
                            })
                        );
                    }
          
                    // Log timeout
                    await Logger.log(client, member.guild.id, {
                        titleKey: 'dm_timeout',
                        descData: { username: member.user.tag },
                        color: '#ff0000',
                        fields: [
                            { 
                                nameKey: 'dm.user_label', 
                                nameData: {}, 
                                value: member.user.tag 
                            },
                            { 
                                nameKey: 'dm.user_id', 
                                nameData: {}, 
                                value: member.user.id 
                            }
                        ]
                    });

                    // Send welcome message with current nickname if timeout
                    if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                        await handleWelcomeMessage(client, member, guildSettings);
                    }
                } catch (error) {
                    console.error(`Failed to send timeout message to ${member.user.tag}:`, error);
          
                    // Log failed DM
                    await Logger.log(client, member.guild.id, {
                        titleKey: 'dm',
                        descData: { username: member.user.tag },
                        color: '#ff0000',
                        fields: [
                            { 
                                nameKey: 'dm.user_label', 
                                nameData: {}, 
                                value: member.user.tag 
                            },
                            { 
                                nameKey: 'dm.user_id', 
                                nameData: {}, 
                                value: member.user.id 
                            },
                            { 
                                nameKey: 'error', 
                                nameData: {}, 
                                value: error.message 
                            }
                        ]
                    });
                }
            }
        });
    } catch (error) {
        console.error(`Failed to interact with ${member.user.tag}: ${error.message}`);
    
        // Log failed interaction
        await Logger.log(client, member.guild.id, {
            titleKey: 'interaction_failed',
            descData: { username: member.user.tag },
            color: '#ff0000',
            fields: [
                { 
                    nameKey: 'dm.user_label', 
                    nameData: {}, 
                    value: member.user.tag 
                },
                { 
                    nameKey: 'dm.user_id', 
                    nameData: {}, 
                    value: member.user.id 
                },
                { 
                    nameKey: 'dm.error', 
                    nameData: {}, 
                    value: error.message 
                }
            ]
        });
    }
}

// Helper function to handle blacklisted users
async function handleBlacklistedUser(member, blacklistedUser, lang, client) {
    try {
        await member.send(
            LanguageManager.getText('events.guildMemberAdd.blacklisted', lang, {
                reason: blacklistedUser.reason
            })
        );
        await member.ban({ reason: blacklistedUser.reason });
    
        await Logger.log(client, member.guild.id, {
            titleKey: 'member_banned',
            descData: { username: member.user.tag },
            color: '#ff0000',
            fields: [
                { 
                    nameKey: 'dm.user_label', 
                    nameData: {}, 
                    value: member.user.tag 
                },
                { 
                    nameKey: 'dm.user_id', 
                    nameData: {}, 
                    value: member.user.id 
                },
                { 
                    nameKey: 'dm.reason_label', 
                    nameData: {}, 
                    value: blacklistedUser.reason 
                }
            ]
        });
    } catch (error) {
        console.error(`Failed to handle blacklisted user ${member.user.tag}: ${error.message}`);
    }
}

// Add a Set to track processed users
const processedUsers = new Set();

// Update handleRegularServer function
async function handleRegularServer(client, member, guildSettings, lang) {
    const userId = member.user.id;
    if (processedUsers.has(userId)) {
        console.log(`Skipping duplicate processing for user ${member.user.tag}`);
        return;
    }
  
    processedUsers.add(userId);
  
    try {
        const dmChannel = await member.createDM();
        const characters = await fetchUserCharacters(client, member.user.id);

        // Case 3: Could not reach user via DM
        if (!dmChannel) {
            if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                await handleWelcomeMessage(client, member, guildSettings);
            }
            return;
        }

        if (!characters || characters.length === 0) {
            try {
                await dmChannel.send(guildSettings.charNameAskDM);
        
                await Logger.log(client, member.guild.id, {
                    titleKey: 'dm_sent',
                    descData: { username: member.user.tag },
                    color: '#00ff00',
                    fields: [
                        { nameKey: 'dm.user_label', nameData: {}, value: member.user.tag },
                        { nameKey: 'dm.user_id', nameData: {}, value: member.user.id }
                    ]
                });
        
                await handleManualInput(client, member, dmChannel, guildSettings, lang);
                return;
            } catch (dmError) {
                console.error(`Failed to send DM to ${member.user.tag}: ${dmError.message}`);
        
                await Logger.log(client, member.guild.id, {
                    titleKey: 'dm_failed',
                    descData: { username: member.user.tag },
                    color: '#ff0000',
                    fields: [
                        { nameKey: 'dm.user_label', nameData: {}, value: member.user.tag },
                        { nameKey: 'dm.user_id', nameData: {}, value: member.user.id },
                        { nameKey: 'error', nameData: {}, value: dmError.message }
                    ]
                });

                // Case 3: Failed to send DM
                if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                    await handleWelcomeMessage(client, member, guildSettings);
                }
                return;
            }
        }

        const row = createCharacterSelectionMenu(characters, lang);
        const selectMessage = await dmChannel.send({
            content: LanguageManager.getText('events.guildMemberAdd.assigned_chars_found', lang),
            components: [row]
        });

        try {
            const response = await selectMessage.awaitMessageComponent({
                filter: i => i.customId === 'character_select' && i.user.id === member.user.id,
                time: TIMEOUT_DURATION,
                componentType: ComponentType.StringSelect
            });

            await response.deferUpdate();
            const selectedValue = response.values[0];

            if (selectedValue === 'not_on_list') {
                const disabledRow = new ActionRowBuilder().addComponents(
                    StringSelectMenuBuilder.from(row.components[0]).setDisabled(true)
                );
                await selectMessage.edit({ components: [disabledRow] });
        
                await handleManualInput(client, member, dmChannel, guildSettings, lang);
            } else {
                const [charName, realm] = selectedValue.split('|');
        
                const message = await handleNicknameChange(client, member, charName, lang, member.guild.name);
                await dmChannel.send(message);
        
                const disabledRow = new ActionRowBuilder().addComponents(
                    StringSelectMenuBuilder.from(row.components[0])
                        .setDisabled(true)
                        .setPlaceholder(`Selected: ${charName}|${realm}`)
                );
                await selectMessage.edit({ components: [disabledRow] });

                // Case 1: Successfully set nickname
                if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                    await handleWelcomeMessage(client, member, guildSettings);
                }
            }
        } catch (error) {
            console.error(`Selection menu timeout for ${member.user.tag}:`, error);
            // Case 2: User reached but timed out
            if (guildSettings.welcomeMessage && guildSettings.welcomeChannel) {
                await handleWelcomeMessage(client, member, guildSettings);
            }
            await handleTimeout(client, member, selectMessage, row, lang);
        }
    } catch (error) {
        console.error(`Error in handleRegularServer for ${member.user.tag}:`, error);
        await Logger.log(client, member.guild.id, {
            titleKey: 'interaction_failed',
            descData: { username: member.user.tag },
            color: '#ff0000',
            fields: [
                { nameKey: 'dm.user_label', nameData: {}, value: member.user.tag },
                { nameKey: 'dm.user_id', nameData: {}, value: member.user.id },
                { nameKey: 'error', nameData: {}, value: error.message }
            ]
        });
    } finally {
        setTimeout(() => {
            processedUsers.delete(userId);
        }, TIMEOUT_DURATION);
    }
}

// Helper function to create character selection menu
function createCharacterSelectionMenu(characters, lang) {
    const options = characters.map(char => ({
        label: char.name,
        value: `${char.name}|${char.realm}`,
        description: `${char.isMain ? '(Main) ' : char.isAlt ? '(Alt) ' : ''}${char.realm}`,
        emoji: char.isMain ? '👑' : char.isAlt ? '🔄' : '👤'
    }));

    options.push({
        label: LanguageManager.getText('events.guildMemberAdd.not_on_list_label', lang),
        value: 'not_on_list',
        description: LanguageManager.getText('events.guildMemberAdd.not_on_list_description', lang),
        emoji: '➕'
    });

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('character_select')
            .setPlaceholder(LanguageManager.getText('events.guildMemberAdd.select_character', lang))
            .addOptions(options)
    );
}

// Update handleTimeout to remove welcome message handling
async function handleTimeout(client, member, selectMessage, row, lang) {
    try {
        const disabledRow = new ActionRowBuilder().addComponents(
            StringSelectMenuBuilder.from(row.components[0])
                .setDisabled(true)
                .setPlaceholder('Selection timed out')
        );
        await selectMessage.edit({ components: [disabledRow] });
    
        try {
            if (member.dmChannel) {
                await member.send(
                    LanguageManager.getText('commands.charname.dm_timeout_message', lang, {
                        guildName: member.guild.name
                    })
                );
            }
        } catch (dmError) {
            console.error(`Failed to send timeout DM to ${member.user.tag}: ${dmError.message}`);
        }
    
        await Logger.log(client, member.guild.id, {
            titleKey: 'dm_timeout',
            descData: { username: member.user.tag },
            color: '#ff0000',
            fields: [
                { nameKey: 'dm.user_label', nameData: {}, value: member.user.tag },
                { nameKey: 'dm.user_id', nameData: {}, value: member.user.id }
            ]
        });
    } catch (error) {
        console.error(`Failed to handle timeout for ${member.user.tag}:`, error);
    }
}

// Update fetchUserCharacters function
async function fetchUserCharacters(client, userId) {
    let characters = [];

    // Get characters from API
    try {
        const response = await https.get(`${config.users.url}/api/user/${userId}/characters`);
        if (response.data && Array.isArray(response.data)) {
            characters = response.data;
        }
    } catch (error) {
        console.error(`[DEBUG] Error fetching API characters: ${error.message}`);
    }

    // Get characters from database
    try {
        const dbUserData = await client.getDatabaseHandler().findOne('userCharacters', { userId });
    
        if (dbUserData) {
            if (dbUserData.main) {
                const mainChar = {
                    name: dbUserData.main.name,
                    realm: dbUserData.main.realm,
                    isMain: true
                };
        
                if (!characters.some(char => 
                    char.name.toLowerCase() === mainChar.name.toLowerCase() && 
          char.realm.toLowerCase() === mainChar.realm.toLowerCase()
                )) {
                    characters.push(mainChar);
                }
            }

            if (dbUserData.alts && Array.isArray(dbUserData.alts)) {
                dbUserData.alts.forEach(alt => {
                    const altChar = {
                        name: alt.name,
                        realm: alt.realm,
                        isAlt: true
                    };
          
                    if (!characters.some(char => 
                        char.name.toLowerCase() === altChar.name.toLowerCase() && 
            char.realm.toLowerCase() === altChar.realm.toLowerCase()
                    )) {
                        characters.push(altChar);
                    }
                });
            }
        }
    } catch (error) {
        console.error(`[DEBUG] Error fetching database characters: ${error.message}`);
    }

    return characters;
}

// Update validateCharacterName function
async function validateCharacterName(client, charName, userChars, lang) {
    if (!charName || charName.length > MAX_CHAR_LENGTH) {
        return {
            valid: false,
            message: LanguageManager.getText('events.guildMemberAdd.invalid_response', lang)
        };
    }

    if (!userChars || Object.keys(userChars).length === 0) {
        userChars = client.getDatabaseHandler().get('userCharacters') || {};
    }

    const charNameLower = charName.toLowerCase();

    for (const [userData] of Object.entries(userChars)) {
        if (userData.main && userData.main.name.toLowerCase() === charNameLower) {
            return { 
                valid: true, 
                realm: userData.main.realm,
                isOwnCharacter: true,
                character: userData.main
            };
        }

        if (userData.alts && Array.isArray(userData.alts)) {
            for (const alt of userData.alts) {
                if (alt.name.toLowerCase() === charNameLower) {
                    return { 
                        valid: true, 
                        realm: alt.realm,
                        isOwnCharacter: true,
                        character: alt
                    };
                }
            }
        }
    }

    const result = await checkAllRealms(charName);
    if (!result.found) {
        return {
            valid: false,
            message: LanguageManager.getText('events.guildMemberAdd.character_not_found', lang)
        };
    }

    return { 
        valid: true, 
        realm: result.realm,
        isNewCharacter: true
    };
}

// Update createWelcomeImage function
async function createWelcomeImage(member) {
    // Fetch fresh member data to get updated nickname
    const freshMember = await member.guild.members.fetch(member.id);
  
    const canvas = createCanvas(1024, 500);
    const ctx = canvas.getContext('2d');

    // Load all images first
    const background = await loadImage(path.join(__dirname, '../../assets/welcome-bg.png'));
    const avatar = await loadImage(freshMember.user.displayAvatarURL({ extension: 'png', size: 256 }));
    const frame = await loadImage(path.join(__dirname, '../../assets/frames.png'));

    // Draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Add dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create clipping circle for avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 190, 125, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  
    // Draw avatar
    ctx.drawImage(avatar, canvas.width / 2 - 125, 65, 250, 250);
    ctx.restore();

    // Draw frame overlay with correct aspect ratio
    const frameWidth = 405;
    const frameHeight = (frameWidth * 320) / 388;
  
    ctx.drawImage(
        frame,
        (canvas.width / 2 - frameWidth / 2) + 45,
        65 - (frameHeight - 250) / 2,
        frameWidth,
        frameHeight
    );

    // Add text
    const displayName = freshMember.nickname || freshMember.user.username;
    const memberCount = freshMember.guild.memberCount || 0;
    ctx.font = 'bold 60px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.fillText(`Welcome ${displayName}`, canvas.width / 2, 400);
    ctx.font = '40px Sans';
    ctx.fillText(`You are member #${memberCount}`, canvas.width / 2, 450);

    // Create attachment using AttachmentBuilder
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { 
        name: 'welcome.png',
        description: 'Welcome image'
    });
    return attachment;
}

// Update the welcome message to use the canvas
async function handleWelcomeMessage(client, member, guildSettings) {
    try {
        // Check if member is still in the guild
        const guild = member.guild;
        const isMemberPresent = await guild.members.fetch(member.id).catch(() => null);
        
        if (!isMemberPresent) {
            console.log(`Member ${member.user.tag} left the server before welcome message could be sent`);
            return;
        }

        const welcomeChannel = guild.channels.cache.get(guildSettings.welcomeChannel);
        if (!welcomeChannel) {
            console.warn(`Welcome channel not found for guild ${guild.id}`);
            return;
        }

        // Check bot permissions in the welcome channel
        const permissions = welcomeChannel.permissionsFor(client.user);
        if (!permissions?.has(['ViewChannel', 'SendMessages', 'AttachFiles'])) {
            console.warn(`Missing required permissions in welcome channel for guild ${guild.id}`);
            
            // Try to notify guild owner
            try {
                const owner = await guild.fetchOwner();
                await owner.send({
                    content: 'I don\'t have the required permissions to send welcome messages in the configured welcome channel. Please ensure I have the following permissions: View Channel, Send Messages, and Attach Files.'
                });
            } catch (dmError) {
                console.warn(`Could not notify guild owner about missing welcome channel permissions in ${guild.id}`);
            }

            // Log the permission issue
            await Logger.log(client, guild.id, {
                titleKey: 'welcome_channel_permission_error',
                descData: { channelId: welcomeChannel.id },
                color: '#ff0000',
                fields: [
                    { 
                        nameKey: 'channel_id',
                        value: welcomeChannel.id
                    },
                    {
                        nameKey: 'missing_permissions',
                        value: 'ViewChannel, SendMessages, AttachFiles'
                    }
                ]
            }).catch(() => {}); // Prevent logging errors from causing issues

            return;
        }

        const welcomeMessage = await createWelcomeImage(member);
        
        try {
            await welcomeChannel.send({ 
                files: [welcomeMessage] 
            });
        } catch (sendError) {
            if (sendError.code === 50013) {
                console.warn(`Missing permissions to send welcome message in guild ${guild.id}`);
            } else {
                console.error('Error sending welcome message:', sendError);
            }
        }

    } catch (error) {
        // More detailed error logging
        const errorDetails = {
            error: error.message,
            stack: error.stack,
            guildId: member.guild.id,
            channelId: guildSettings.welcomeChannel,
            memberTag: member.user.tag
        };

        console.error('Welcome Message Error:', errorDetails);

        // Log the error to the logging system
        await Logger.log(client, member.guild.id, {
            titleKey: 'welcome_message_error',
            descData: { error: error.message },
            color: '#ff0000',
            fields: [
                { 
                    nameKey: 'error_details',
                    value: JSON.stringify(errorDetails, null, 2).substring(0, 1024)
                }
            ]
        }).catch(() => {}); // Prevent logging errors from causing issues
    }
}

// Update main event handler
module.exports = new Event({
    event: 'guildMemberAdd',
    once: false,
    run: async (client, member) => {
        if (member.user.bot) return;

        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: member.guild.id
        }) || { guild: member.guild.id };

        const lang = guildSettings.language || 'en';

        // Only send welcome message immediately if CharNameAsk is disabled
        if (guildSettings.welcomeMessage && guildSettings.welcomeChannel && !guildSettings.CharNameAsk) {
            await handleWelcomeMessage(client, member, guildSettings);
        }

        // Handle blacklisted users
        if (guildSettings.BlockList) {
            const blacklistedUser = await client.getDatabaseHandler().findOne('blacklisted', {
                id: member.id
            });
      
            if (blacklistedUser && member.guild.id !== config.development.guildId) {
                await handleBlacklistedUser(member, blacklistedUser, lang, client);
                return;
            }
        }

        // Development server handling
        if (member.guild.id === config.development.guildId) {
            await handleDevServer(client, member, guildSettings, lang);
            return;
        }

        // Regular server handling
        if (guildSettings.CharNameAsk) {
            await handleRegularServer(client, member, guildSettings, lang);
        }
    },
});
