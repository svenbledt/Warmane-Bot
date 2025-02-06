/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    EmbedBuilder,
    ApplicationCommandOptionType,
    PermissionsBitField
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const config = require('../../config');
const cheerio = require('cheerio');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const itemsDB = require('../../itemsdb.json');
const LanguageManager = require('../../utils/LanguageManager');
const Logger = require('../../utils/Logger');

// Define an axios instance with rate limit applied
const https = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 4000,
});

// Update findCharacterOwner function to use async/await with Mongoose
const findCharacterOwner = async (client, charName, realm) => {
    const userCharacter = await client.database_handler.findOne('userCharacters', {
        $or: [
            { 'main.name': { $regex: new RegExp(`^${charName}$`, 'i') }, 'main.realm': realm },
            { 'alts': { 
                $elemMatch: { 
                    'name': { $regex: new RegExp(`^${charName}$`, 'i') },
                    'realm': realm 
                }
            }}
        ]
    });

    if (!userCharacter) return null;

    const isMain = userCharacter.main?.name.toLowerCase() === charName.toLowerCase() && 
                 userCharacter.main?.realm === realm;

    return {
        userId: userCharacter.userId,
        isMain: isMain
    };
};

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
                    }
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
                    }
                ]
            }
        ],
        contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
        
    },
    options: {
        cooldown: 5000,
    },
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        // Get guild settings for language
        const guildSettings = await client.database_handler.findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';
        
        if (subcommand === 'name') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            
            // Check for BanMembers permission
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.editReply({
                    content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                    flags: [MessageFlags.Ephemeral],
                });
            }

            const TIMEOUT_DURATION = 600000; // 10 minutes in milliseconds
            try {
                const user = interaction.options.getUser('user', true);
                const member = interaction.guild.members.cache.get(user.id);
                
                try {
                    const dmChannel = await member.createDM();
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

                    try {
                        const collected = await dmChannel.awaitMessages({ 
                            filter: (m) => m.author.id === member.id,
                            max: 1, 
                            time: TIMEOUT_DURATION,
                            errors: ['time'] 
                        });
              
                        const response = collected.first().content.replace(/[^a-zA-Z ]/g, '').trim();
              
                        if (!response) {
                            await dmChannel.send(
                                LanguageManager.getText('commands.charname.empty_response', lang)
                            );
                            return;
                        }

                        try {
                            await member.setNickname(response);
                
                            await Logger.log(client, interaction.guildId, {
                                titleKey: 'nickname_changed',
                                descData: { username: member.user.tag, nickname: response },
                                color: '#00ff00',
                                fields: [
                                    { nameKey: 'dm.user_label', value: member.user.tag },
                                    { nameKey: 'dm.user_id', value: member.user.id },
                                    { nameKey: 'nickname_changed.new_nickname', value: response }
                                ]
                            });
                
                            await dmChannel.send(
                                LanguageManager.getText('commands.charname.nickname_success', lang, {
                                    nickname: response
                                })
                            );
                        } catch (error) {
                            console.error(`Failed to change nickname: ${error.message}`);
                            await dmChannel.send(
                                LanguageManager.getText('commands.charname.nickname_failed', lang, {
                                    error: error.message
                                })
                            );
                        }
                    } catch (timeoutError) {
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
                } catch (error) {
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
            } catch (error) {
                console.error('Error:', error);
                return interaction.editReply({
                    content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
                        error: error.message
                    }),
                    flags: [MessageFlags.Ephemeral],
                });
            }
        }

        if (subcommand === 'info') {
            const charName = interaction.options.getString('character', true);
            const realm = interaction.options.getString('realm', true);
            const invisible = interaction.options.getBoolean('invisible', false);

            const charNameFormatted =
                charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();

            // First, check if the character exists
            try {
                const response = await https.get(
                    `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
                );
                const characterData = response.data;

                // If the character does not exist, return an error message
                if (!characterData || !characterData.name) {
                    return interaction.reply({
                        content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
                            character: charNameFormatted
                        }),
                        flags: [MessageFlags.Ephemeral],
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                return interaction.reply({
                    content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
                        error: error.message
                    }),
                    flags: [MessageFlags.Ephemeral],
                });
            }

            // Handle character info command
            await interaction.deferReply({
                content: LanguageManager.getText('commands.charinfo.loading', lang),
                flags: invisible ? [MessageFlags.Ephemeral] : [],
            });

            // Continue with character info logic...
            async function makeRequest(url) {
                try {
                    const response = await https.get(url);
                    return response.data;
                } catch (error) {
                    if (error.response && error.response.status === 429) {
                        console.log('Too many requests, retrying after 4 seconds...');
                        await new Promise((resolve) => setTimeout(resolve, 4000));
                        return makeRequest(url);
                    } else {
                        throw error;
                    }
                }
            }

            const fetchCharacterData = makeRequest(
                `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
            );

            const fetchArmoryData = makeRequest(
                `${config.users.url}/character/${charNameFormatted}/${realm}/`
            );

            Promise.all([fetchCharacterData, fetchArmoryData])
                .then(async ([data, body]) => {
                    if (!data || !data.name) {
                        return interaction.editReply({
                            content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
                                character: charNameFormatted
                            }),
                            flags: [MessageFlags.Ephemeral],
                        });
                    }

                    const items = data.equipment.map((item) => item.item);
                    const itemsMap = new Map(
                        itemsDB.items.map((item) => [item.itemID, item])
                    );

                    let totalGearScore = 0;
                    const weapons = [];

                    for (const item of items) {
                        const localItem = itemsMap.get(Number(item));

                        if (localItem) {
                            if (
                                localItem.class === 2 &&
                                (localItem.subclass === 1 ||
                                    localItem.subclass === 5 ||
                                    localItem.subclass === 8)
                            ) {
                                weapons.push(localItem.GearScore);
                            } else {
                                totalGearScore += localItem.GearScore;
                            }
                        }
                    }

                    if (weapons.length === 2) {
                        totalGearScore += Math.floor((weapons[0] + weapons[1]) / 2);
                    } else if (weapons.length === 1) {
                        totalGearScore += weapons[0];
                    }

                    const totalGearScoreString = totalGearScore.toString();

                    if (data.name === charNameFormatted) {
                        const character = {
                            name: data.name,
                            realm: data.realm,
                            online: data.online,
                            level: data.level,
                            faction: data.faction,
                            gender: data.gender,
                            race: data.race,
                            class: data.class,
                            honorableKills: data.honorablekills,
                            guild: data.guild || 'None',
                            achievementPoints: data.achievementpoints,
                            talents: data.talents.map((talent) => talent.tree),
                            professions: data.professions,
                            totalGearScore: totalGearScoreString
                        };

                        // Check if the character has a guild
                        if (!character.guild) {
                            character.guild = 'None';
                        }
                    
                        function getParams(params) {
                            params = params.split('&');
                            const paramsMap = {};
                            params.forEach(function (p) {
                                const v = p.split('=');
                                paramsMap[v[0]] = decodeURIComponent(v[1]);
                            });
                            return paramsMap;
                        }
                    
                        // Initialize missingGems and missingEnchants arrays
                        const missingGems = [];
                        const missingEnchants = [];
                        const itemNames = [
                            'Head',
                            'Neck',
                            'Shoulders',
                            'Cloak',
                            'Chest',
                            'Shirt',
                            'Tabard',
                            'Bracer',
                            'Gloves',
                            'Belt',
                            'Legs',
                            'Boots',
                            'Ring #1',
                            'Ring #2',
                            'Trinket #1',
                            'Trinket #2',
                            'Main-hand',
                            'Off-hand',
                            'Ranged',
                        ];
                        const bannedItems = [1, 5, 6, 9, 14, 15];
                    
                        // Start the HTTP request
                        const $ = cheerio.load(body);
                        const itemIDs = [];
                        const actualItems = [];
                        let i = 0;
                        const characterClass = $('.level-race-class').text().toLowerCase();
                        // map professions to array from data
                        const professions = character.professions.map(
                            (profession) => profession.name
                        );
                    
                        // Only check for missing enchants and gems if character is level 80
                        const maxLevels = [60, 70, 80]; // Classic, TBC, WotLK max levels
                        const shouldCheckMissing = maxLevels.includes(character.level);
                    
                        $('.item-model a').each(function () {
                            const rel = $(this).attr('rel');
                            if (rel) {
                                const params = getParams(rel);
                                const amount = params['gems']
                                    ? params['gems'].split(':').filter((x) => x !== '0').length
                                    : 0;
                            
                                itemIDs.push({
                                    itemID: Number(params['item']),
                                });
                            
                                actualItems.push({
                                    itemID: Number(params['item']),
                                    gems: amount,
                                    type: itemNames[i],
                                });
                            
                                // Only check for missing enchants if character is level 80
                                if (shouldCheckMissing && !bannedItems.includes(i)) {
                                    const isEnchanted = rel.indexOf('ench') !== -1;
                                
                                    if (!isEnchanted) {
                                        if (
                                            itemNames[i] === 'Ranged' &&
                        character.class.toLowerCase() === 'hunter'
                                        ) {
                                            missingEnchants.push(itemNames[i]);
                                        } else if (
                                            (itemNames[i] === 'Ring #1' ||
                          itemNames[i] === 'Ring #2') &&
                        professions.includes('Enchanting')
                                        ) {
                                            missingEnchants.push(itemNames[i]);
                                        } else if (
                                            itemNames[i] === 'Off-hand' &&
                        !['mage', 'warlock', 'druid', 'priest'].some(
                            (cls) =>
                                cls.toLowerCase() === character.class.toLowerCase()
                        )
                                        ) {
                                            missingEnchants.push(itemNames[i]);
                                        } else if (
                                            (itemNames[i] === 'Gloves' || itemNames[i] === 'Boots') &&
                        !professions.includes('Engineering')
                                        ) {
                                            missingEnchants.push(itemNames[i]);
                                        } else if (
                                            !['Ranged', 'Ring #1', 'Ring #2'].includes(itemNames[i])
                                        ) {
                                            missingEnchants.push(itemNames[i]);
                                        }
                                    }
                                }
                                i++;
                            }
                        });
                    
                        const items = itemsDB.items.filter((item) =>
                            itemIDs.some((id) => id.itemID === item.itemID)
                        );
                    
                        // Check if character has Blacksmithing
                        const hasBlacksmithing = professions.includes('Blacksmithing');
                    
                        // Only check for missing gems if character is level 80
                        if (shouldCheckMissing) {
                            items.forEach((item) => {
                                const foundItem = actualItems.filter(
                                    (x) => x.itemID === item.itemID
                                )[0];
                            
                                // Skip gem check for Gloves and Bracers if character has Blacksmithing
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
                            });
                        }
                    
                        // Switch based on characters Faction icon
                        switch (character.faction) {
                        case 'Alliance':
                            character.icon = config.base.iconAlliance;
                            break;
                        case 'Horde':
                            character.icon = config.base.iconHorde;
                            break;
                        }
                    
                        // check character race and gender to set thumbnail icon
                        switch (character.race) {
                        case 'Human':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.humanFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.humanMale;
                                break;
                            }
                            break;
                        case 'Orc':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.orcFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.orcMale;
                                break;
                            }
                            break;
                        case 'Dwarf':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.dwarfFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.dwarfMale;
                                break;
                            }
                            break;
                        case 'Night Elf':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.nightElfFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.nightElfMale;
                                break;
                            }
                            break;
                        case 'Undead':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.undeadFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.undeadMale;
                                break;
                            }
                            break;
                        case 'Tauren':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.taurenFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.taurenMale;
                                break;
                            }
                            break;
                        case 'Gnome':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.gnomeFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.gnomeMale;
                                break;
                            }
                            break;
                        case 'Troll':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.trollFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.trollMale;
                                break;
                            }
                            break;
                        case 'Blood Elf':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.bloodElfFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.bloodElfMale;
                                break;
                            }
                            break;
                        case 'Draenei':
                            switch (character.gender) {
                            case 'Female':
                                character.portrait = config.base.draeneiFemale;
                                break;
                            case 'Male':
                                character.portrait = config.base.draeneiMale;
                                break;
                            }
                        }
                    
                        // Set color based on class
                        switch (character.class.toLowerCase()) {
                        case 'death knight':
                            character.color = '#C41E3A';
                            break;
                        case 'druid':
                            character.color = '#FF7C0A';
                            break;
                        case 'hunter':
                            character.color = '#AAD372';
                            break;
                        case 'mage':
                            character.color = '#3FC7EB';
                            break;
                        case 'paladin':
                            character.color = '#F48CBA';
                            break;
                        case 'priest':
                            character.color = '#FFFFFF';
                            break;
                        case 'rogue':
                            character.color = '#FFF468';
                            break;
                        case 'shaman':
                            character.color = '#0070DD';
                            break;
                        case 'warlock':
                            character.color = '#8788EE';
                            break;
                        case 'warrior':
                            character.color = '#C69B6D';
                            break;
                        }
                    
                        if (character) {
                            const armoryLink = `${config.users.url}character/${charNameFormatted}/${realm}/`;
                            // Create base fields without missing gems/enchants
                            const embedFields = [
                                {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.character', lang),
                                    value: character.name,
                                    inline: true
                                },
                                {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.class', lang),
                                    value: character.class,
                                    inline: true
                                },
                                {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.realm', lang),
                                    value: character.realm,
                                    inline: true
                                },
                            
                                {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.online', lang),
                                    value: character.online ? LanguageManager.getText('commands.charinfo.embed.fields.yes', lang) : LanguageManager.getText('commands.charinfo.embed.fields.no', lang),
                                    inline: true,
                                },
                                {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.level', lang),
                                    value: character.level.toString(),
                                    inline: true
                                },
                                character.guild !== 'None' && {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.guild', lang),
                                    value: character.guild,
                                    inline: true
                                },
                                character.honorableKills > 0 && {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.honorable_kills', lang),
                                    value: character.honorableKills.toString(),
                                    inline: true
                                },
                                character.achievementPoints > 0 && {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.achievement_points', lang),
                                    value: character.achievementPoints.toString(),
                                    inline: true
                                },
                                character.totalGearScore > 0 && character.level > 60  && {
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.gearscore', lang),
                                    value: character.totalGearScore.toString(),
                                    inline: true
                                }
                            ].filter(Boolean);
                        
                            // Add owner information if it exists
                            const ownerInfo = await findCharacterOwner(client, character.name, realm);
                        
                            if (ownerInfo) {
                                embedFields.push({
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.belongs_to', lang),
                                    value: `<@${ownerInfo.userId}> (${ownerInfo.isMain ? 'Main' : 'Alt'})`,
                                    inline: true
                                });
                            }
                        
                            // Add talents to the embed fields
                            if (character.talents && character.talents.length > 0) {
                                embedFields.push({
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.talents', lang),
                                    value: character.talents.join(' / '),
                                    inline: true
                                });
                            }
                        
                            // Add missing gems and enchants after owner info (only for level 80)
                            if (shouldCheckMissing) {
                                if (missingGems.length > 0) {
                                    embedFields.push({
                                        name: LanguageManager.getText('commands.charinfo.embed.fields.missing_gems', lang),
                                        value: missingGems.join(', '),
                                        inline: true
                                    });
                                }
                                if (missingEnchants.length > 0) {
                                    embedFields.push({
                                        name: LanguageManager.getText('commands.charinfo.embed.fields.missing_enchants', lang),
                                        value: missingEnchants.join(', '),
                                        inline: true
                                    });
                                }
                            }
                        
                            const embed = new EmbedBuilder()
                                .setColor(character.color || '#8B0000')
                                .setTitle(LanguageManager.getText('commands.charinfo.embed.title', lang))
                                .setDescription(
                                    LanguageManager.getText('commands.charinfo.embed.description', lang, {
                                        character: charNameFormatted,
                                        url: armoryLink
                                    })
                                )
                                .setThumbnail(character.portrait)
                                .setTimestamp(new Date())
                                .setFooter({
                                    text: interaction.guild?.name ?? 'Warmane Tool',
                                    iconURL: character.icon,
                                });
                            
                            // Add fields to the embed
                            embedFields.forEach((field) => {
                                embed.addFields(field);
                            });
                        
                            // Check if the character has professions
                            if (character.professions && character.professions.length > 0) {
                                const professions = character.professions
                                    .map((profession) => `${profession.name}: ${profession.skill}`)
                                    .join('\n');
                                embed.addFields({
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.professions', lang),
                                    value: professions,
                                    inline: true,
                                });
                            }
                        
                            // Check if the character has pvp teams
                            if (data.pvpteams && data.pvpteams.length > 0) {
                                const pvpteams = data.pvpteams
                                    .map(
                                        (team) =>
                                            LanguageManager.getText('commands.charinfo.embed.fields.teams', lang, {
                                                type: team.type,
                                                name: team.name,
                                                rating: team.rating,
                                                rank: team.rank
                                            })
                                    )
                                    .join('\n');
                                embed.addFields({
                                    name: LanguageManager.getText('commands.charinfo.embed.fields.pvp_teams', lang),
                                    value: pvpteams,
                                    inline: false,
                                });
                            }
                        
                            await interaction.editReply({
                                embeds: [embed],
                                flags: invisible ? [MessageFlags.Ephemeral] : [],
                            });
                        }
                    }
                });

        } else if (subcommand === 'list') {
            // Handle character list command
            const targetUser = interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers]) 
                ? (interaction.options.getUser('user') || interaction.user)
                : interaction.user;

            const userData = await client.database_handler.findOne('userCharacters', {
                userId: targetUser.id
            });

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

            await interaction.reply({
                embeds: [embed],
                flags: [MessageFlags.Ephemeral],
            });
        }
    }
});