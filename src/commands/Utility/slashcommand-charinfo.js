const {EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");
const cheerio = require('cheerio');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const itemsDB = require("../../itemsdb.json");

// Define an axios instance with rate limit applied
const https = rateLimit(axios.create(), {maxRequests: 1, perMilliseconds: 4000});

module.exports = new ApplicationCommand({
    command: {
        name: 'charinfo', description: 'Gives some information about any character on Warmane.', type: 1, options: [
            {
                name: 'character',
                description: 'Select the character u want Information from.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'realm',
                description: 'Select the realm of the character.',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {name: 'Icecrown', value: 'Icecrown'},
                    {name: 'Onyxia', value: 'Onyxia'},
                    {name: 'Lordaeron', value: 'Lordaeron'},
                    {name: 'Frostwolf', value: 'Frostwolf'},
                    {name: 'Blackrock', value: 'Blackrock'},
                ]
            }
        ],
    },
    options: {
        cooldown: 10000,
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const charName = interaction.options.getString('character', true);
        const charNameFormatted = charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();

        // First, check if the character exists
        try {
            const response = await https.get(`${config.users.url}/api/character/${charNameFormatted}/${interaction.options.getString('realm', true)}/summary`);
            const characterData = response.data;

            // If the character does not exist, return an error message
            if (!characterData || !characterData.name) {
                return interaction.reply({
                    content: `The character ${charNameFormatted} does not exist.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error:', error);
            return interaction.reply({
                content: `An error occurred while fetching the character data.`,
                ephemeral: true
            });
        }

        // Immediately reply to the interaction with a loading state
        await interaction.deferReply({
            content: "We're looking for your data. Please be patient.",
            ephemeral: true
        });

        // Define a function to make the request
        async function makeRequest(url) {
            try {
                const response = await https.get(url);
                return response.data;
            } catch (error) {
                if (error.response && error.response.status === 429) { // HTTP 429 Too Many Requests
                    console.log('Too many requests, retrying after 4 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 1 second
                    return makeRequest(url); // Retry the request
                } else {
                    throw error; // If it's another error, throw it
                }
            }
        }

        // Use the function to make the requests
        const fetchCharacterData = makeRequest(`${config.users.url}/api/character/${charNameFormatted}/${interaction.options.getString('realm', true)}/summary`);

        const fetchArmoryData = makeRequest(`${config.users.url}/character/${charNameFormatted}/${interaction.options.getString('realm', true)}/`);

        Promise.all([fetchCharacterData, fetchArmoryData]).then(async ([data, body]) => {
            // If the character does not exist, return an error message
            if (!data || !data.name) {
                return interaction.editReply({
                    content: `The character ${charNameFormatted} does not exist.`,
                    ephemeral: true
                });
            }
            const items = data.equipment.map(item => item.item);

            // Use a Map for faster lookups
            const itemsMap = new Map(itemsDB.items.map(item => [item.itemID, item]));

            let totalGearScore = 0;
            let weapons = [];

            for (let item of items) {
                // Look up items in constant time
                const localItem = itemsMap.get(Number(item));

                if (localItem) {
                    if (localItem.class === 2 && (localItem.subclass === 1 || localItem.subclass === 5 || localItem.subclass === 8)) {
                        weapons.push(localItem.GearScore);
                    } else {
                        totalGearScore += localItem.GearScore;
                    }
                }
            }

            // Handle the weapons array
            if (weapons.length === 2) {
                // If there are two weapons, add the average of their gearscores to the total
                totalGearScore += Math.floor((weapons[0] + weapons[1]) / 2);
            } else if (weapons.length === 1) {
                // If there is one weapon, add its gearscore to the total
                totalGearScore += weapons[0];
            }

            // Convert the total gearscore to a string
            const totalGearScoreString = totalGearScore.toString();

            // Find the character in the data
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
                    guild: data.guild,
                    achievementPoints: data.achievementpoints,
                    talents: data.talents.map(talent => talent.tree),
                    professions: data.professions
                };

                // Check if the character has a guild
                if (!character.guild) {
                    character.guild = "None";
                }

                function getParams(params) {
                    params = params.split("&");
                    let paramsMap = {};
                    params.forEach(function (p) {
                        let v = p.split("=");
                        paramsMap[v[0]] = decodeURIComponent(v[1]);
                    });
                    return paramsMap;
                }

                // Initialize missingGems and missingEnchants arrays
                let missingGems = [];
                let missingEnchants = [];
                const itemNames = ["Head", "Neck", "Shoulders", "Cloak", "Chest", "Shirt", "Tabard", "Bracer", "Gloves", "Belt", "Legs", "Boots", "Ring #1", "Ring #2", "Trinket #1", "Trinket #2", "Main-hand", "Off-hand", "Ranged"];
                const bannedItems = [1, 5, 6, 9, 14, 15];


                // Start the HTTP request
                const $ = cheerio.load(body);
                let itemIDs = [];
                let actualItems = [];
                let i = 0;
                let characterClass = $(".level-race-class").text().toLowerCase();
                // map professions to array from data
                let professions = character.professions.map(profession => profession.name);
                $(".item-model a").each(function () {
                    let rel = $(this).attr("rel");
                    if (rel) {
                        let params = getParams(rel);
                        let amount = params["gems"] ? params["gems"].split(":").filter(x => x !== '0').length : 0;

                        itemIDs.push({
                            "itemID": Number(params["item"])
                        });

                        actualItems.push({
                            "itemID": Number(params["item"]),
                            "gems": amount,
                            "type": itemNames[i]
                        });
                        if (!bannedItems.includes(i)) {
                            let isEnchanted = rel.indexOf("ench") !== -1;

                            if (!isEnchanted) {
                                if (itemNames[i] === "Ranged" && (character.class === "Hunter" || character.class === "Warrior")) {
                                    missingEnchants.push(itemNames[i]);
                                } else if ((itemNames[i] === "Ring #1" || itemNames[i] === "Ring #2") && professions.includes("Enchanting")) {
                                    missingEnchants.push(itemNames[i]);
                                } else if (itemNames[i] === "Off-hand" && !["mage", "warlock", "druid", "priest"].some(cls => character.class === cls)) {
                                    missingEnchants.push(itemNames[i]);
                                } else if ((itemNames[i] === "Gloves" || itemNames[i] === "Boots") && !professions.includes("Engineering")) {
                                    missingEnchants.push(itemNames[i]);
                                } else if (!["Ranged", "Ring #1", "Ring #2"].includes(itemNames[i])) {
                                    missingEnchants.push(itemNames[i]);
                                }
                            }
                        }
                        i++;
                    }
                });

                let items = itemsDB.items.filter(item => itemIDs.some(id => id.itemID === item.itemID));

                items.forEach(item => {
                    let foundItem = actualItems.filter(x => x.itemID === item.itemID)[0];
                    if (foundItem.type === "Belt") {
                        if ((item.gems + 1) !== foundItem.gems) {
                            missingGems.push(foundItem.type);
                        }
                    } else {
                        if (item.gems !== foundItem.gems) {
                            missingGems.push(foundItem.type);
                        }
                    }
                });

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

                // set color based on class
                switch (character.class) {
                    case 'Death Knight':
                        character.color = '#C41E3A';
                        break;
                    case 'Druid':
                        character.color = '#FF7C0A';
                        break;
                    case 'Hunter':
                        character.color = '#AAD372';
                        break;
                    case 'Mage':
                        character.color = '#3FC7EB';
                        break;
                    case 'Paladin':
                        character.color = '#F48CBA';
                        break;
                    case 'Priest':
                        character.color = '#FFFFFF';
                        break;
                    case 'Rogue':
                        character.color = '#FFF468';
                        break;
                    case 'Shaman':
                        character.color = '#0070DD';
                        break;
                    case 'Warlock':
                        character.color = '#8788EE';
                        break;
                    case 'Warrior':
                        character.color = '#C69B6D';
                        break;
                }

                if (character) {
                    // If the character is found, create an embed with the information
                    const embed = new EmbedBuilder()
                        .setColor(character.color || '#8B0000')
                        .setTitle('Character Information')
                        .setDescription(`Information about ${charNameFormatted}`)
                        .setThumbnail(character.portrait)
                        .setTimestamp(new Date())
                        .setFooter({text: interaction.guild.name, iconURL: character.icon});

                    // Add fields to the embed
                    const fields = [
                        {name: 'Character', value: character.name, inline: true},
                        {name: 'Realm', value: character.realm, inline: true},
                        {name: 'Online', value: character.online ? 'Yes' : 'No', inline: true},
                        {name: 'Level', value: character.level, inline: true},
                        {name: 'Faction', value: character.faction, inline: true},
                        {name: 'Gender', value: character.gender, inline: true},
                        {name: 'Race', value: character.race, inline: true},
                        {name: 'Class', value: character.class, inline: true},
                        {name: 'Honorable Kills', value: character.honorableKills, inline: true},
                        {name: 'Guild', value: character.guild, inline: true},
                        {name: 'Achievement Points', value: character.achievementPoints, inline: true},
                        {name: 'Talents', value: character.talents.join(', '), inline: true},
                        {name: 'GearScore', value: totalGearScoreString, inline: true},
                    ];

                    // Only add fields with non-empty values
                    fields.forEach(field => {
                        if (field.value) {
                            embed.addFields(field);
                        }
                    });

                    // Check if the character has professions
                    if (character.professions && character.professions.length > 0) {
                        const professions = character.professions.map(profession => `${profession.name}: ${profession.skill}`).join('\n');
                        embed.addFields({name: 'Professions', value: professions, inline: true});
                    }

                    // Check if the character has pvp teams
                    if (data.pvpteams && data.pvpteams.length > 0) {
                        const pvpteams = data.pvpteams.map(team => `${team.type}: ${team.name} (Rating: ${team.rating}, Rank: ${team.rank})`).join('\n');
                        embed.addFields({name: 'PvP Teams', value: pvpteams, inline: true});
                    }

                    // Check if the character has missing gems
                    const gems = missingGems.join('\n');
                    embed.addFields({name: 'Missing Gems', value: gems || "None"});

                    // Check if the character has missing enchants
                    const enchants = missingEnchants.join('\n');
                    embed.addFields({name: 'Missing Enchants', value: enchants || "None"});

                    await interaction.editReply({embeds: [embed], ephemeral: true});
                }
            }
        }).catch(error => console.error('Error:', error));
    }
}).toJSON();