const {EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");
const itemsDB = require("../../itemsdb.json");

module.exports = new ApplicationCommand({
    command: {
        name: 'charinfo', description: 'Gives some information about a member of the Guild.', type: 1, options: [
            {
                name: 'character',
                description: 'Gives information about a member of the Guild.',
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
        // fetching json data from the API
        const charName = interaction.options.getString('character', true);
        const charNameFormatted = charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();
        fetch(`${config.users.url}/${charNameFormatted}/${interaction.options.getString('realm', true)}/summary`)
            .then(response => response.json())
            .then(data => {

                const items = data.equipment.map(item => item.item);

                // Initialize total gearscore
                let totalGearScore = 0;

                // Iterate over the items
                for (let item of items) {
                    // Find the item in your local database
                    const localItem = itemsDB.items.find(localItem => localItem.itemID === Number(item));

                    // If the item is found, add its gearscore to the total
                    if (localItem) {
                        totalGearScore += localItem.GearScore;
                    }
                }

                // Convert the total gearscore to a string
                const totalGearScoreString = totalGearScore.toString();

                // Now you can use 'totalGearScoreString' wherever you need it

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
                        honorablekills: data.honorablekills,
                        guild: data.guild,
                        achievementpoints: data.achievementpoints,
                        talents: data.talents.map(talent => talent.tree),
                        professions: data.professions
                    };

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
                            .addFields(
                                {name: 'Character', value: character.name, inline: true},
                                {name: 'Realm', value: character.realm, inline: true},
                                {name: 'Online', value: character.online ? 'Yes' : 'No', inline: true},
                                {name: 'Level', value: character.level, inline: true},
                                {name: 'Faction', value: character.faction, inline: true},
                                {name: 'Gender', value: character.gender, inline: true},
                                {name: 'Race', value: character.race, inline: true},
                                {name: 'Class', value: character.class, inline: true},
                                {name: 'Honorable Kills', value: character.honorablekills, inline: true},
                                {name: 'Guild', value: character.guild, inline: true},
                                {name: 'Achievement Points', value: character.achievementpoints, inline: true},
                                {name: 'Talents', value: character.talents.join(', '), inline: true},
                                {name: 'GearScore', value: totalGearScoreString, inline: true},
                            )
                            .setThumbnail(character.portrait)
                            .setTimestamp(new Date())
                            .setFooter({text: interaction.guild.name, iconURL: character.icon});

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

                        interaction.reply({embeds: [embed], ephemeral: true});
                    } else {
                        // If the character is not found, send a message indicating that the character is not a member of RSA Legends
                        interaction.reply({
                            content: `The character ${charNameFormatted} doesnt exist.`,
                            ephemeral: true
                        });
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    }
}).toJSON();