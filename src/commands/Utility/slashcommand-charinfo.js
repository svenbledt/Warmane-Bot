const {EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

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
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp(new Date())
                            .setFooter({text: interaction.guild.name, iconURL: client.user.displayAvatarURL()});

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