/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    EmbedBuilder,
    ApplicationCommandOptionType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const config = require('../../config');
const cheerio = require('cheerio');
const itemsDB = require('../../itemsdb.json');
const LanguageManager = require('../../utils/LanguageManager');
const Logger = require('../../utils/Logger');
const CharacterUtils = require('../../utils/CharacterUtils');

// Add these functions after the imports and before the command handlers

async function getGuildLanguage(client, guildId) {
    const guildSettings = await client.getDatabaseHandler().findOne('settings', {
        guild: guildId
    });
    return guildSettings?.language || 'en';
}

// DM-related helper functions
async function sendInitialDM(client, interaction, dmChannel, member, lang) {
    const guildSettings = await client.getDatabaseHandler().findOne('settings', {
        guild: interaction.guildId
    });
    
    const dmMessage = guildSettings?.charNameAskDM || 
        LanguageManager.getText('commands.charname.dm_initial', lang);

    await dmChannel.send(dmMessage);

    await Logger.log(client, interaction.guildId, {
        titleKey: 'dm_sent',
        descData: { username: member.user.tag },
        color: '#00ff00',
        fields: [
            { nameKey: 'dm.user_label', value: member.user.tag },
            { nameKey: 'dm.user_id', value: member.user.id },
        ]
    });

    await interaction.editReply({
        content: LanguageManager.getText('commands.global_strings.dm_sent', lang, {
            username: member.user.tag
        })
    });
}

async function handleDMResponse(client, interaction, dmChannel, member, timeout, lang) {
    try {
        const collected = await dmChannel.awaitMessages({ 
            filter: (m) => m.author.id === member.id,
            max: 1, 
            time: timeout,
            errors: ['time'] 
        });

        const response = collected.first().content.replace(/[^a-zA-Z ]/g, '').trim();

        if (!response) {
            await dmChannel.send(
                LanguageManager.getText('commands.charname.empty_response', lang)
            );
            return;
        }

        await updateNickname(client, interaction, member, response, lang);
    } catch (error) {
        await handleDMTimeout(client, interaction, dmChannel, member, lang);
    }
}

async function updateNickname(client, interaction, member, nickname, lang) {
    try {
        await member.setNickname(nickname);

        await Logger.log(client, interaction.guildId, {
            titleKey: 'nickname_changed',
            descData: { username: member.user.tag, nickname: nickname },
            color: '#00ff00',
            fields: [
                { nameKey: 'dm.user_label', value: member.user.tag },
                { nameKey: 'dm.user_id', value: member.user.id },
                { nameKey: 'nickname_changed.new_nickname', value: nickname }
            ]
        });

        await member.createDM().then(channel => 
            channel.send(
                LanguageManager.getText('commands.charname.nickname_success', lang, {
                    nickname: nickname
                })
            )
        );
    } catch (error) {
        console.error(`Failed to change nickname: ${error.message}`);
        await member.createDM().then(channel => 
            channel.send(
                LanguageManager.getText('commands.charname.nickname_failed', lang, {
                    error: error.message
                })
            )
        );
    }
}

async function handleDMTimeout(client, interaction, dmChannel, member, lang) {
    await dmChannel.send(
        LanguageManager.getText('commands.charname.dm_timeout_message', lang, {
            guildName: interaction.guild.name
        })
    );

    await Logger.log(client, interaction.guildId, {
        titleKey: 'dm_timeout',
        descData: { username: member.user.tag },
        color: '#ff0000',
        fields: [
            { nameKey: 'dm.user_label', value: member.user.tag },
            { nameKey: 'dm.user_id', value: member.user.id },
        ]
    });
}

async function handleDMError(client, interaction, member, error, lang) {
    await interaction.editReply({
        content: LanguageManager.getText('commands.global_strings.dm_failed', lang, {
            username: member.user.tag
        })
    });

    await Logger.log(client, interaction.guildId, {
        titleKey: 'dm',
        descData: { username: member.user.tag },
        color: '#ff0000',
        fields: [
            { nameKey: 'dm.user_label', value: member.user.tag },
            { nameKey: 'dm.user_id', value: member.user.id },
            { nameKey: 'dm.error_label', value: error.message }
        ]
    });
}

// Character list helper functions
function createCharacterListEmbed(userData, targetUser, lang) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(LanguageManager.getText('commands.charlist.embed.title', lang, {
            username: targetUser.username
        }))
        .setTimestamp();

    if (!userData || (!userData.main && (!userData.alts || userData.alts.length === 0))) {
        embed.setDescription(LanguageManager.getText('commands.charlist.embed.no_characters', lang));
    } else {
        let description = '';

        if (userData.main) {
            description += LanguageManager.getText('commands.charlist.embed.main_character', lang, {
                name: userData.main.name,
                realm: userData.main.realm
            }) + '\n\n';
        }

        if (userData.alts && userData.alts.length > 0) {
            description += LanguageManager.getText('commands.charlist.embed.alt_characters_header', lang) + '\n';
            userData.alts.forEach(alt => {
                description += LanguageManager.getText('commands.charlist.embed.character_entry', lang, {
                    name: alt.name,
                    realm: alt.realm
                }) + '\n';
            });
        }

        embed.setDescription(description);
    }

    return embed;
}

// Error handling
async function handleCommandError(interaction, error, lang) {
    const reply = interaction.replied ? interaction.editReply : interaction.reply;
    await reply.call(interaction, {
        content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
            error: error.message
        }),
        flags: [MessageFlags.Ephemeral]
    });
}

// Set command helpers
async function validateSetCommandPermissions(interaction, lang) {
    const isDeveloper = config.users.developers.includes(interaction.user.id);

    if (!interaction.guild) {
        await interaction.reply({
            content: LanguageManager.getText('commands.global_strings.guild_only', lang),
            flags: [MessageFlags.Ephemeral],
        });
        return false;
    }

    if (!isDeveloper && !interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
        await interaction.reply({
            content: LanguageManager.getText('commands.global_strings.no_permission', lang),
            flags: [MessageFlags.Ephemeral],
        });
        return false;
    }

    return true;
}

async function handleSetCommandError(interaction, error, lang) {
    console.error('Error in set-char command:', error);
    return interaction.reply({
        content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
            error: error.message
        }),
        flags: [MessageFlags.Ephemeral],
    });
}

// Helper functions for command handlers
async function handleNameCommand(client, interaction, lang) {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.editReply({
            content: LanguageManager.getText('commands.global_strings.no_permission', lang),
            flags: [MessageFlags.Ephemeral],
        });
    }

    const TIMEOUT_DURATION = 600000; // 10 minutes
    const user = interaction.options.getUser('user', true);
    const member = interaction.guild.members.cache.get(user.id);

    try {
        const dmChannel = await member.createDM();
        await sendInitialDM(client, interaction, dmChannel, member, lang);
        await handleDMResponse(client, interaction, dmChannel, member, TIMEOUT_DURATION, lang);
    } catch (error) {
        await handleDMError(client, interaction, member, error, lang);
    }
}

async function handleInfoCommand(client, interaction, lang) {
    const charName = interaction.options.getString('character', true);
    const realm = interaction.options.getString('realm', true);
    const invisible = interaction.options.getBoolean('invisible', false);
    
    const charNameFormatted = CharacterUtils.formatCharacterName(charName);

    try {
        // Verify character exists
        const characterData = await CharacterUtils.verifyCharacter(charNameFormatted, realm);
        if (!characterData) {
            return interaction.reply({
                content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
                    character: charNameFormatted
                }),
                flags: [MessageFlags.Ephemeral],
            });
        }

        await interaction.deferReply({
            content: LanguageManager.getText('commands.charinfo.loading', lang),
            flags: invisible ? [MessageFlags.Ephemeral] : [],
        });

        const { summary, armory } = await CharacterUtils.fetchCharacterData(charNameFormatted, realm);
        await processAndDisplayCharacterInfo(client, interaction, summary, armory, charNameFormatted, realm, invisible, lang);
    } catch (error) {
        console.error('Error in info command:', error);
        return interaction.reply({
            content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
                error: error.message
            }),
            flags: [MessageFlags.Ephemeral],
        });
    }
}

async function handleListCommand(client, interaction, lang) {
    const targetUser = interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers]) 
        ? (interaction.options.getUser('user') || interaction.user)
        : interaction.user;

    const userData = await client.getDatabaseHandler().findOne('userCharacters', {
        userId: targetUser.id
    });

    const embed = createCharacterListEmbed(userData, targetUser, lang);

    await interaction.reply({
        embeds: [embed],
        flags: [MessageFlags.Ephemeral],
    });
}

async function handleSetCommand(client, interaction, lang) {
    const user = interaction.options.getUser('user', true);
    const charName = interaction.options.getString('character', true);
    const realm = interaction.options.getString('realm', true);
    const charType = interaction.options.getString('type', true);
    const isMain = charType === 'main';

    if (!await validateSetCommandPermissions(interaction, lang)) return;

    const charNameFormatted = CharacterUtils.formatCharacterName(charName);

    try {
        await processSetCommand(client, interaction, user, charNameFormatted, realm, isMain, lang);
    } catch (error) {
        await handleSetCommandError(interaction, error, lang);
    }
}

// Add this after the other helper functions
async function processAndDisplayCharacterInfo(client, interaction, summary, armoryBody, charNameFormatted, realm, invisible, lang) {
    if (!summary || !summary.name) {
        return interaction.editReply({
            content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
                character: charNameFormatted
            }),
            flags: [MessageFlags.Ephemeral],
        });
    }

    const itemsMap = new Map(itemsDB.items.map((item) => [item.itemID, item]));
    const totalGearScore = CharacterUtils.calculateGearScore(summary.equipment, itemsMap);

    const character = {
        name: summary.name,
        realm: summary.realm,
        online: summary.online,
        level: summary.level,
        faction: summary.faction,
        gender: summary.gender,
        race: summary.race,
        class: summary.class,
        honorableKills: summary.honorablekills,
        guild: summary.guild || 'None',
        achievementPoints: summary.achievementpoints,
        talents: summary.talents.map((talent) => talent.tree),
        professions: summary.professions,
        totalGearScore: totalGearScore.toString()
    };

    // Parse armory data for gems and enchants
    const $ = cheerio.load(armoryBody);
    const { missingGems, missingEnchants } = await processArmoryData($, character, itemsDB);

    // Set character appearance
    setCharacterAppearance(character);

    // Create and send embed
    const embed = await createCharacterEmbed(client, character, charNameFormatted, realm, missingGems, missingEnchants, summary, lang, interaction);

    await interaction.editReply({
        embeds: [embed],
        flags: invisible ? [MessageFlags.Ephemeral] : [],
    });
}

function processArmoryData($, character, itemsDB) {
    const itemNames = [
        'Head', 'Neck', 'Shoulders', 'Cloak', 'Chest', 'Shirt', 'Tabard',
        'Bracer', 'Gloves', 'Belt', 'Legs', 'Boots', 'Ring #1', 'Ring #2',
        'Trinket #1', 'Trinket #2', 'Main-hand', 'Off-hand', 'Ranged',
    ];
    const bannedItems = [1, 5, 6, 9, 14, 15];
    const missingGems = [];
    const missingEnchants = [];
    const itemIDs = [];
    const actualItems = [];
    
    const professions = character.professions.map(p => p.name);
    const hasBlacksmithing = professions.includes('Blacksmithing');
    const shouldCheckMissing = [60, 70, 80].includes(Number(character.level));

    let i = 0;
    $('.item-model a').each(function() {
        const rel = $(this).attr('rel');
        if (!rel) {
            i++;
            return;
        }

        const params = getParams(rel);
        const amount = params['gems'] ? params['gems'].split(':').filter(x => x !== '0').length : 0;

        itemIDs.push({
            itemID: Number(params['item'])
        });

        actualItems.push({
            itemID: Number(params['item']),
            gems: amount,
            type: itemNames[i]
        });

        if (shouldCheckMissing && !bannedItems.includes(i)) {
            const isEnchanted = rel.indexOf('ench') !== -1;

            if (!isEnchanted) {
                if (itemNames[i] === 'Ranged' && character.class.toLowerCase() === 'hunter') {
                    missingEnchants.push(itemNames[i]);
                } else if ((itemNames[i] === 'Ring #1' || itemNames[i] === 'Ring #2') && 
                           professions.includes('Enchanting')) {
                    missingEnchants.push(itemNames[i]);
                } else if (itemNames[i] === 'Off-hand' && 
                          !['mage', 'warlock', 'druid', 'priest'].includes(character.class.toLowerCase())) {
                    missingEnchants.push(itemNames[i]);
                } else if ((itemNames[i] === 'Gloves' || itemNames[i] === 'Boots') && 
                          !professions.includes('Engineering')) {
                    missingEnchants.push(itemNames[i]);
                } else if (!['Ranged', 'Ring #1', 'Ring #2'].includes(itemNames[i])) {
                    missingEnchants.push(itemNames[i]);
                }
            }
        }
        i++;
    });

    if (shouldCheckMissing) {
        const items = itemsDB.items.filter(item => 
            itemIDs.some(id => id.itemID === item.itemID)
        );

        items.forEach(item => {
            const foundItem = actualItems.find(x => x.itemID === item.itemID);
            if (foundItem) {
                if (hasBlacksmithing && (foundItem.type === 'Gloves' || foundItem.type === 'Bracer')) {
                    return;
                }

                if (foundItem.type === 'Belt') {
                    if (item.gems + 1 !== foundItem.gems) {
                        missingGems.push(foundItem.type);
                    }
                } else {
                    if (item.gems !== foundItem.gems) {
                        missingGems.push(foundItem.type);
                    }
                }
            }
        });
    }

    return { missingGems, missingEnchants };
}

function getParams(params) {
    const paramsMap = {};
    params.split('&').forEach(p => {
        const [key, value] = p.split('=');
        paramsMap[key] = decodeURIComponent(value);
    });
    return paramsMap;
}

function setCharacterAppearance(character) {
    // Set faction icon
    character.icon = character.faction === 'Alliance' ? config.base.iconAlliance : config.base.iconHorde;

    // Set class color
    const classColors = {
        'death knight': '#C41E3A',
        'druid': '#FF7C0A',
        'hunter': '#AAD372',
        'mage': '#3FC7EB',
        'paladin': '#F48CBA',
        'priest': '#FFFFFF',
        'rogue': '#FFF468',
        'shaman': '#0070DD',
        'warlock': '#8788EE',
        'warrior': '#C69B6D'
    };
    character.color = classColors[character.class.toLowerCase()] || '#8B0000';

    // Set portrait based on race and gender
    const portraits = {
        'Human': { 'Female': config.base.humanFemale, 'Male': config.base.humanMale },
        'Orc': { 'Female': config.base.orcFemale, 'Male': config.base.orcMale },
        'Dwarf': { 'Female': config.base.dwarfFemale, 'Male': config.base.dwarfMale },
        'Night Elf': { 'Female': config.base.nightelfFemale, 'Male': config.base.nightelfMale },
        'Undead': { 'Female': config.base.undeadFemale, 'Male': config.base.undeadMale },
        'Tauren': { 'Female': config.base.taurenFemale, 'Male': config.base.taurenMale },
        'Gnome': { 'Female': config.base.gnomeFemale, 'Male': config.base.gnomeMale },
        'Troll': { 'Female': config.base.trollFemale, 'Male': config.base.trollMale },
        'Blood Elf': { 'Female': config.base.bloodElfFemale, 'Male': config.base.bloodElfMale },
        'Draenei': { 'Female': config.base.draeneiFemale, 'Male': config.base.draeneiMale }
    };
    character.portrait = portraits[character.race]?.[character.gender] || config.base.defaultPortrait;
}

async function createCharacterEmbed(client, character, charNameFormatted, realm, missingGems, missingEnchants, data, lang, interaction) {
    const armoryLink = `${config.users.url}character/${charNameFormatted}/${realm}/`;
    const embed = new EmbedBuilder()
        .setColor(character.color)
        .setTitle(LanguageManager.getText('commands.charinfo.embed.title', lang))
        .setDescription(LanguageManager.getText('commands.charinfo.embed.description', lang, {
            character: charNameFormatted,
            url: armoryLink
        }))
        .setThumbnail(character.portrait)
        .setTimestamp()
        .setFooter({
            text: interaction.guild?.name ?? 'Warmane Tool',
            iconURL: character.icon,
        });

    // Add basic fields
    addBasicFields(embed, character, lang);
    
    // Add owner info
    const ownerInfo = await CharacterUtils.findCharacterOwner(client, character.name, realm);
    if (ownerInfo) {
        embed.addFields({
            name: LanguageManager.getText('commands.charinfo.embed.fields.belongs_to', lang),
            value: `<@${ownerInfo.userId}> (${ownerInfo.isMain ? 'Main' : 'Alt'})`,
            inline: true
        });
    }

    // Add additional fields
    addAdditionalFields(embed, character, missingGems, missingEnchants, data, lang);

    return embed;
}

async function processSetCommand(client, interaction, user, charNameFormatted, realm, isMain, lang) {
    // Verify character exists
    const characterData = await CharacterUtils.verifyCharacter(charNameFormatted, realm);
    if (!characterData) {
        return interaction.reply({
            content: LanguageManager.getText('commands.setchar.char_not_exist', lang, {
                character: charNameFormatted
            }),
            flags: [MessageFlags.Ephemeral],
        });
    }

    // Check existing ownership
    const existingOwner = await checkExistingOwner(client, charNameFormatted, realm);
    if (existingOwner) {
        const shouldContinue = await handleExistingOwner(interaction, existingOwner, charNameFormatted, lang);
        if (!shouldContinue) return;
    } else {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    }

    // Update character ownership
    await updateCharacterOwnership(client, interaction, user, charNameFormatted, realm, isMain, existingOwner, lang);
}

async function checkExistingOwner(client, charNameFormatted, realm) {
    const allUserChars = await client.getDatabaseHandler().find('userCharacters', {});
    
    for (const userData of allUserChars) {
        if (userData.main && 
            userData.main.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            userData.main.realm === realm) {
            return { userId: userData.userId, isMain: true };
        }
        
        if (userData.alts && userData.alts.some(alt => 
            alt.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            alt.realm === realm)) {
            return { userId: userData.userId, isMain: false };
        }
    }
    
    return null;
}

async function handleExistingOwner(interaction, existingOwner, charNameFormatted, lang) {
    const isDeveloper = config.users.developers.includes(interaction.user.id);
    const baseMessage = LanguageManager.getText('commands.setchar.char_already_assigned', lang, {
        character: charNameFormatted,
        user: `<@${existingOwner.userId}>`
    });

    if (!isDeveloper) {
        await interaction.reply({
            content: baseMessage,
            flags: [MessageFlags.Ephemeral],
        });
        return false;
    }

    const confirmed = await showConfirmationDialog(interaction, baseMessage);
    return confirmed;
}

async function showConfirmationDialog(interaction, baseMessage) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('No')
            .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
        content: `${baseMessage}\n\nAs a developer, would you like to reassign this character?`,
        components: [row],
        flags: [MessageFlags.Ephemeral],
    });

    try {
        const confirmation = await interaction.channel.awaitMessageComponent({
            filter: (i) => i.user.id === interaction.user.id && i.message.interaction.id === interaction.id,
            time: 30000,
            componentType: ComponentType.Button,
        });

        if (confirmation.customId === 'cancel') {
            await confirmation.update({
                content: 'Operation cancelled.',
                components: [],
            });
            return false;
        }

        await confirmation.update({
            content: 'Processed.',
            components: [],
        });
        return true;
    } catch (e) {
        await interaction.editReply({
            content: 'No response received within 30 seconds. Operation cancelled.',
            components: [],
        });
        return false;
    }
}

async function updateCharacterOwnership(client, interaction, user, charNameFormatted, realm, isMain, existingOwner, lang) {
    if (existingOwner) {
        await removeExistingOwnership(client, existingOwner, charNameFormatted, realm);
    }

    const userData = await getOrCreateUserData(client, user.id);
    const charData = createCharacterData(charNameFormatted, realm, interaction.user.id);

    if (isMain) {
        if (userData.main) {
            userData.alts.push(userData.main);
        }
        userData.main = charData;
    } else {
        userData.alts.push(charData);
    }

    await client.getDatabaseHandler().updateOne(
        'userCharacters',
        { userId: user.id },
        userData,
        { upsert: true }
    );

    const responseContent = createResponseContent(isMain, userData, charNameFormatted, realm, user, lang);
    await interaction.editReply({
        content: responseContent,
        flags: [MessageFlags.Ephemeral],
    });
}

function addBasicFields(embed, character, lang) {
    const baseFields = [
        ['character', character.name],
        ['class', character.class],
        ['realm', character.realm],
        ['online', character.online ? 'yes' : 'no'],
        ['level', character.level.toString()],
        character.guild !== 'None' && ['guild', character.guild],
        character.honorableKills > 0 && ['honorable_kills', character.honorableKills.toString()],
        character.achievementPoints > 0 && ['achievement_points', character.achievementPoints.toString()],
        character.totalGearScore > 0 && character.level > 60 && ['gearscore', character.totalGearScore]
    ].filter(Boolean);

    baseFields.forEach(([key, value]) => {
        embed.addFields({
            name: LanguageManager.getText(`commands.charinfo.embed.fields.${key}`, lang),
            value: value,
            inline: true
        });
    });
}

function addAdditionalFields(embed, character, missingGems, missingEnchants, data, lang) {

    // Add talents
    if (character.talents?.length > 0) {
        embed.addFields({
            name: LanguageManager.getText('commands.charinfo.embed.fields.talents', lang),
            value: character.talents.join(' / '),
            inline: true
        });
    }

    // Add missing gems and enchants
    const shouldCheckMissing = [60, 70, 80].includes(Number(character.level));
    
    if (shouldCheckMissing) {
        if (missingGems.length > 0) {
            embed.addFields({
                name: LanguageManager.getText('commands.charinfo.embed.fields.missing_gems', lang),
                value: missingGems.join(', '),
                inline: true
            });
        }
        if (missingEnchants.length > 0) {
            embed.addFields({
                name: LanguageManager.getText('commands.charinfo.embed.fields.missing_enchants', lang),
                value: missingEnchants.join(', '),
                inline: true
            });
        }
    }

    // Add professions
    if (character.professions?.length > 0) {
        const professions = character.professions
            .map(profession => `${profession.name}: ${profession.skill}`)
            .join('\n');
        embed.addFields({
            name: LanguageManager.getText('commands.charinfo.embed.fields.professions', lang),
            value: professions,
            inline: true
        });
    }

    // Add PvP teams
    if (data.pvpteams?.length > 0) {
        const pvpteams = data.pvpteams
            .map(team => LanguageManager.getText('commands.charinfo.embed.fields.teams', lang, {
                type: team.type,
                name: team.name,
                rating: team.rating,
                rank: team.rank
            }))
            .join('\n');
        embed.addFields({
            name: LanguageManager.getText('commands.charinfo.embed.fields.pvp_teams', lang),
            value: pvpteams,
            inline: false
        });
    }
}

async function removeExistingOwnership(client, existingOwner, charNameFormatted, realm) {
    const prevUserData = await client.getDatabaseHandler().findOne('userCharacters', { userId: existingOwner.userId });
    if (existingOwner.isMain) {
        prevUserData.main = null;
    } else {
        prevUserData.alts = prevUserData.alts.filter(alt => 
            !(alt.name.toLowerCase() === charNameFormatted.toLowerCase() && alt.realm === realm)
        );
    }
    await client.getDatabaseHandler().updateOne('userCharacters', { userId: existingOwner.userId }, prevUserData);
}

async function getOrCreateUserData(client, userId) {
    let userData = await client.getDatabaseHandler().findOne('userCharacters', { userId });
    if (!userData) {
        userData = {
            userId,
            main: null,
            alts: []
        };
    }
    return userData;
}

function createCharacterData(charNameFormatted, realm, addedById) {
    return {
        name: charNameFormatted,
        realm: realm,
        addedBy: addedById,
        addedAt: new Date().toISOString()
    };
}

function createResponseContent(isMain, userData, charNameFormatted, realm, user, lang) {
    if (isMain && userData.alts.length > 0) {
        return LanguageManager.getText('commands.setchar.success_updated', lang, {
            character: charNameFormatted,
            realm: realm,
            user: `<@${user.id}>`,
            oldCharacter: userData.alts[userData.alts.length - 1].name
        });
    } else {
        return LanguageManager.getText('commands.setchar.success_with_type', lang, {
            character: charNameFormatted,
            realm: realm,
            user: `<@${user.id}>`,
            type: isMain ? 'main' : 'alt'
        });
    }
}

module.exports = new ApplicationCommand({
    command: {
        name: 'char',
        description: 'Character related commands',
        type: 1,
        options: [
            {
                name: 'info',
                description: 'Get information about a character on Warmane',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'character',
                        description: 'Select the character you want Information from.',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: 'realm',
                        description: 'Select the realm of the character.',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: 'Icecrown', value: 'Icecrown' },
                            { name: 'Onyxia', value: 'Onyxia' },
                            { name: 'Lordaeron', value: 'Lordaeron' },
                            { name: 'Frostwolf', value: 'Frostwolf' },
                            { name: 'Blackrock', value: 'Blackrock' },
                        ],
                    },
                    {
                        name: 'invisible',
                        description: 'Is the result invisible for other people?',
                        type: ApplicationCommandOptionType.Boolean,
                        required: true,
                    },
                ],
            },
            {
                name: 'list',
                description: 'List characters assigned to a user',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        description: 'The user to list characters for',
                        type: ApplicationCommandOptionType.User,
                        required: false,
                    },
                ],
            },
            {
                name: 'name',
                description: 'Ask someone for their character name',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        description: 'The user to ask for their character name',
                        type: ApplicationCommandOptionType.User,
                        required: true,
                    },
                ],
            },
            {
                name: 'set',
                description: 'Set a character for a user',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        description: 'The user to set the character for',
                        type: ApplicationCommandOptionType.User,
                        required: true,
                    },
                    {
                        name: 'character',
                        description: 'Character name',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: 'realm',
                        description: 'Character realm',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: 'Icecrown', value: 'Icecrown' },
                            { name: 'Onyxia', value: 'Onyxia' },
                            { name: 'Lordaeron', value: 'Lordaeron' },
                            { name: 'Frostwolf', value: 'Frostwolf' },
                            { name: 'Blackrock', value: 'Blackrock' },
                        ],
                    },
                    {
                        name: 'type',
                        description: 'Character type (main or alt)',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: 'Main Character', value: 'main' },
                            { name: 'Alt Character', value: 'alt' },
                        ],
                    },
                ],
            },
        ],
        contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    },
    options: {
        cooldown: 5000,
    },
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const lang = await getGuildLanguage(client, interaction.guildId);

        try {
            switch (subcommand) {
            case 'name':
                await handleNameCommand(client, interaction, lang);
                break;
            case 'info':
                await handleInfoCommand(client, interaction, lang);
                break;
            case 'list':
                await handleListCommand(client, interaction, lang);
                break;
            case 'set':
                await handleSetCommand(client, interaction, lang);
                break;
            }
        } catch (error) {
            console.error(`Error in ${subcommand} command:`, error);
            await handleCommandError(interaction, error, lang);
        }
    },
});
