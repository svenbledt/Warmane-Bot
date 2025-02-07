/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    ApplicationCommandOptionType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const config = require('../../config');

// Define an axios instance with rate limit
const https = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 4000,
});

module.exports = new ApplicationCommand({
    command: {
        name: 'set-char',
        description: 'Set a character for a user',
        type: 1,
        contexts: [0],
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
    options: {
        cooldown: 5000,
    },
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user', true);
        const charName = interaction.options.getString('character', true);
        const realm = interaction.options.getString('realm', true);
        const charType = interaction.options.getString('type', true);
        const isMain = charType === 'main';
    
        // Check if user is a developer
        const isDeveloper = config.users.developers.includes(interaction.user.id);
    
        // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        // Check if command is used in DMs
        if (!interaction.guild) {
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.guild_only', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        if (!isDeveloper && !interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        const charNameFormatted = charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();

        try {
            // Verify character exists on Warmane
            const response = await https.get(
                `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
            );
      
            if (!response.data || !response.data.name) {
                return interaction.reply({
                    content: LanguageManager.getText('commands.setchar.char_not_exist', lang, {
                        character: charNameFormatted
                    }),
                    flags: [MessageFlags.Ephemeral],
                });
            }

            // Get user characters data
            const allUserChars = await client.getDatabaseHandler().find('userCharacters', {});
      
            // Check if character is already assigned to someone
            let existingOwner = null;
            for (const userData of allUserChars) {
                // Check main character
                if (userData.main && 
            userData.main.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            userData.main.realm === realm) {
                    existingOwner = { userId: userData.userId, isMain: true };
                    break;
                }
                // Check alt characters
                if (userData.alts && userData.alts.some(alt => 
                    alt.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            alt.realm === realm)) {
                    existingOwner = { userId: userData.userId, isMain: false };
                    break;
                }
            }

            // If character is already assigned, inform the user
            if (existingOwner) {
                const baseMessage = LanguageManager.getText('commands.setchar.char_already_assigned', lang, {
                    character: charNameFormatted,
                    user: `<@${existingOwner.userId}>`
                });

                // For developers, show confirmation buttons
                if (isDeveloper) {
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
                            return;
                        }

                        await confirmation.update({
                            content: 'Processed.',
                            components: [],
                        });
                    } catch (e) {
                        await interaction.editReply({
                            content: `No response received within 30 seconds. Operation cancelled. ${e}`,
                            components: [],
                        });
                        return;
                    }
                } else {
                    await interaction.reply({
                        content: baseMessage,
                        flags: [MessageFlags.Ephemeral],
                    });
                    return;
                }
            } else {
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            }

            // If we get here, either there's no existing owner or developer confirmed reassignment
            if (existingOwner) {
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

            // Get or create user data
            let userData = await client.getDatabaseHandler().findOne('userCharacters', { userId: user.id });
            if (!userData) {
                userData = {
                    userId: user.id,
                    main: null,
                    alts: []
                };
            }

            const charData = {
                name: charNameFormatted,
                realm: realm,
                addedBy: interaction.user.id,
                addedAt: new Date().toISOString()
            };

            if (isMain) {
                // If user already has a main character, move it to alts
                if (userData.main) {
                    userData.alts.push(userData.main);
                }
                userData.main = charData;
            } else {
                userData.alts.push(charData);
            }

            // Update or insert user data
            await client.getDatabaseHandler().updateOne('userCharacters', { userId: user.id }, userData, { upsert: true });

            let responseContent;
            if (isMain && userData.alts.length > 0) {
                responseContent = LanguageManager.getText('commands.setchar.success_updated', lang, {
                    character: charNameFormatted,
                    realm: realm,
                    user: `<@${user.id}>`,
                    oldCharacter: userData.alts[userData.alts.length - 1].name
                });
            } else {
                responseContent = LanguageManager.getText('commands.setchar.success_with_type', lang, {
                    character: charNameFormatted,
                    realm: realm,
                    user: `<@${user.id}>`,
                    type: isMain ? 'main' : 'alt'
                });
            }

            await interaction.editReply({
                content: responseContent,
                flags: [MessageFlags.Ephemeral],
            });

        } catch (error) {
            console.error('Error in set-char command:', error);
            return interaction.reply({
                content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
                    error: error.message
                }),
                flags: [MessageFlags.Ephemeral],
            });
        }
    },
});
