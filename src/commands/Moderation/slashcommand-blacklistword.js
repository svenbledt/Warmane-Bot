/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');

module.exports = new ApplicationCommand({
    command: {
        name: 'blacklistword',
        description: 'Manage blacklisted words for the server.',
        type: 1,
        contexts: [0], // Guild only
        options: [
            {
                name: 'add',
                description: 'Add a word to the blacklist',
                type: 1, // Subcommand
                options: [
                    {
                        name: 'word',
                        description: 'The word to blacklist',
                        type: 3, // String
                        required: true,
                        max_length: 50,
                    },
                    {
                        name: 'reason',
                        description: 'Reason for blacklisting this word',
                        type: 3, // String
                        required: false,
                        max_length: 200,
                    },
                    {
                        name: 'case_sensitive',
                        description: 'Whether the word check should be case sensitive',
                        type: 5, // Boolean
                        required: false,
                    },
                    {
                        name: 'delete_message',
                        description: 'Whether to delete messages containing this word',
                        type: 5, // Boolean
                        required: false,
                    },
                    {
                        name: 'warn_user',
                        description: 'Whether to warn the user when this word is used',
                        type: 5, // Boolean
                        required: false,
                    },
                    {
                        name: 'use_context_analysis',
                        description:
              'Whether to analyze context to determine appropriate usage',
                        type: 5, // Boolean
                        required: false,
                    },
                    {
                        name: 'context_threshold',
                        description: 'Confidence threshold for context analysis (0-100%)',
                        type: 4, // Integer
                        required: false,
                        min_value: 0,
                        max_value: 100
                    },
                    {
                        name: 'global',
                        description: 'Make this word global (bot developers only)',
                        type: 5, // Boolean
                        required: false,
                    },
                ],
            },
            {
                name: 'remove',
                description: 'Remove a word from the blacklist',
                type: 1, // Subcommand
                options: [
                    {
                        name: 'word',
                        description: 'The word to remove from blacklist',
                        type: 3, // String
                        required: true,
                        max_length: 50,
                    },
                ],
            },
            {
                name: 'list',
                description: 'List all blacklisted words',
                type: 1, // Subcommand
                options: [
                    {
                        name: 'page',
                        description: 'Page number to display',
                        type: 4, // Integer
                        required: false,
                        min_value: 1,
                    },
                ],
            },
            {
                name: 'toggle',
                description: 'Enable or disable a blacklisted word',
                type: 1, // Subcommand
                options: [
                    {
                        name: 'word',
                        description: 'The word to toggle',
                        type: 3, // String
                        required: true,
                        max_length: 50,
                    },
                ],
            },
        ],
    },
    options: {
        botDevelopers: false,
        cooldown: 3000,
    },
    /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
    run: async (client, interaction) => {
    // Get guild settings for language
        const guildSettings = await client
            .getDatabaseHandler()
            .findOne('settings', {
                guild: interaction.guildId,
            });
        const lang = guildSettings?.language || 'en';

        if (!interaction.guild) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.global_strings.guild_only',
                    lang
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }

        // Check if the user has manage messages permission
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.ManageMessages
            )
        ) {
            await interaction.reply({
                content: LanguageManager.getText(
                    'commands.global_strings.no_permission',
                    lang
                ),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
        case 'add':
            await handleAddWord(client, interaction, lang);
            break;
        case 'remove':
            await handleRemoveWord(client, interaction, lang);
            break;
        case 'list':
            await handleListWords(client, interaction, lang);
            break;
        case 'toggle':
            await handleToggleWord(client, interaction, lang);
            break;
        }
    },
});

async function handleAddWord(client, interaction, lang) {
    const word = interaction.options.getString('word').toLowerCase();
    const reason = interaction.options.getString('reason') || '';
    const caseSensitive =
    interaction.options.getBoolean('case_sensitive') ?? false;
    const deleteMessage =
    interaction.options.getBoolean('delete_message') ?? true;
    const warnUser = interaction.options.getBoolean('warn_user') ?? true;
    const useContextAnalysis =
    interaction.options.getBoolean('use_context_analysis') ?? true;
    const contextThreshold =
    (interaction.options.getInteger('context_threshold') ?? 20) / 100;
    const global = interaction.options.getBoolean('global') ?? false;

    // Check if user is trying to make a global word
    if (global) {
    // Check if user is a bot developer
        if (!client.config.users.developers.includes(interaction.user.id)) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.global_strings.bot_developer_only',
                    lang
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }
    }

    try {
    // Check if word already exists (for global words, check globally; for server words, check server)
        const existingWord = await client
            .getDatabaseHandler()
            .findOne('blacklistedWords', {
                guild: global ? { $exists: false } : interaction.guildId,
                word: caseSensitive ? word : word.toLowerCase(),
                global: global,
            });

        if (existingWord) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.blacklistword.word_already_exists',
                    lang,
                    { word }
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }

        // Add the word to blacklist
        await client.getDatabaseHandler().create('blacklistedWords', {
            guild: global ? null : interaction.guildId,
            word: caseSensitive ? word : word.toLowerCase(),
            addedBy: interaction.user.id,
            addedByUsername: interaction.user.username,
            reason,
            caseSensitive,
            deleteMessage,
            warnUser,
            useContextAnalysis,
            contextThreshold,
            global,
        });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(
                LanguageManager.getText('commands.blacklistword.added_title', lang)
            )
            .setDescription(
                LanguageManager.getText(
                    'commands.blacklistword.added_description',
                    lang,
                    { word }
                )
            )
            .addFields(
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.word',
                        lang
                    ),
                    value: word,
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.added_by',
                        lang
                    ),
                    value: interaction.user.username,
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.case_sensitive',
                        lang
                    ),
                    value: caseSensitive ? '✅' : '❌',
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.delete_message',
                        lang
                    ),
                    value: deleteMessage ? '✅' : '❌',
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.warn_user',
                        lang
                    ),
                    value: warnUser ? '✅' : '❌',
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.context_analysis',
                        lang
                    ),
                    value: useContextAnalysis ? '✅' : '❌',
                    inline: true,
                },
                {
                    name: LanguageManager.getText(
                        'commands.blacklistword.fields.context_threshold',
                        lang
                    ),
                    value: `${(contextThreshold * 100).toFixed(0)}%`,
                    inline: true,
                }
            )
            .setTimestamp();

        if (reason) {
            embed.addFields({
                name: LanguageManager.getText(
                    'commands.blacklistword.fields.reason',
                    lang
                ),
                value: reason,
            });
        }

        await interaction.reply({ embeds: [embed] });

        // Log the action if logging is enabled (only for server words, not global)
        if (!global) {
            const guildSettings = await client
                .getDatabaseHandler()
                .findOne('settings', { guild: interaction.guildId });
            if (guildSettings?.enableLogging && guildSettings?.logChannel) {
                const logChannel = client.channels.cache.get(guildSettings.logChannel);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle(
                            LanguageManager.getText(
                                'logging.blacklisted_word_added.title',
                                lang
                            )
                        )
                        .setDescription(
                            LanguageManager.getText(
                                'logging.blacklisted_word_added.description',
                                lang,
                                { word, username: interaction.user.username }
                            )
                        )
                        .addFields(
                            {
                                name: LanguageManager.getText(
                                    'logging.blacklisted_word_added.fields.added_by',
                                    lang
                                ),
                                value: `${interaction.user.username} (${interaction.user.id})`,
                                inline: true,
                            },
                            {
                                name: LanguageManager.getText(
                                    'logging.blacklisted_word_added.fields.channel',
                                    lang
                                ),
                                value: interaction.channel.name,
                                inline: true,
                            }
                        )
                        .setTimestamp();

                    if (reason) {
                        logEmbed.addFields({
                            name: LanguageManager.getText(
                                'logging.blacklisted_word_added.fields.reason',
                                lang
                            ),
                            value: reason,
                        });
                    }

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
        }
    } catch (error) {
        console.error('Error adding blacklisted word:', error);
        await interaction.reply({
            content: LanguageManager.getText(
                'commands.global_strings.error_occurred',
                lang,
                { error: error.message }
            ),
            flags: [MessageFlags.Ephemeral],
        });
    }
}

async function handleRemoveWord(client, interaction, lang) {
    const word = interaction.options.getString('word');

    try {
    // Find and remove the word
        const result = await client
            .getDatabaseHandler()
            .deleteOne('blacklistedWords', {
                guild: interaction.guildId,
                word: word.toLowerCase(),
            });

        if (result.deletedCount === 0) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.blacklistword.word_not_found',
                    lang,
                    { word }
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(
                LanguageManager.getText('commands.blacklistword.removed_title', lang)
            )
            .setDescription(
                LanguageManager.getText(
                    'commands.blacklistword.removed_description',
                    lang,
                    { word }
                )
            )
            .addFields({
                name: LanguageManager.getText(
                    'commands.blacklistword.fields.removed_by',
                    lang
                ),
                value: interaction.user.username,
                inline: true,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log the action if logging is enabled
        const guildSettings = await client
            .getDatabaseHandler()
            .findOne('settings', { guild: interaction.guildId });
        if (guildSettings?.enableLogging && guildSettings?.logChannel) {
            const logChannel = client.channels.cache.get(guildSettings.logChannel);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle(
                        LanguageManager.getText(
                            'logging.blacklisted_word_removed.title',
                            lang
                        )
                    )
                    .setDescription(
                        LanguageManager.getText(
                            'logging.blacklisted_word_removed.description',
                            lang,
                            { word, username: interaction.user.username }
                        )
                    )
                    .addFields(
                        {
                            name: LanguageManager.getText(
                                'logging.blacklisted_word_removed.fields.removed_by',
                                lang
                            ),
                            value: `${interaction.user.username} (${interaction.user.id})`,
                            inline: true,
                        },
                        {
                            name: LanguageManager.getText(
                                'logging.blacklisted_word_removed.fields.channel',
                                lang
                            ),
                            value: interaction.channel.name,
                            inline: true,
                        }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    } catch (error) {
        console.error('Error removing blacklisted word:', error);
        await interaction.reply({
            content: LanguageManager.getText(
                'commands.global_strings.error_occurred',
                lang,
                { error: error.message }
            ),
            flags: [MessageFlags.Ephemeral],
        });
    }
}

async function handleListWords(client, interaction, lang) {
    const page = interaction.options.getInteger('page') || 1;
    const wordsPerPage = 10;

    try {
        const blacklistedWords = await client
            .getDatabaseHandler()
            .find('blacklistedWords', {
                guild: interaction.guildId,
            });

        if (blacklistedWords.length === 0) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.blacklistword.no_words',
                    lang
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }

        const totalPages = Math.ceil(blacklistedWords.length / wordsPerPage);
        const startIndex = (page - 1) * wordsPerPage;
        const endIndex = startIndex + wordsPerPage;
        const pageWords = blacklistedWords.slice(startIndex, endIndex);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
                LanguageManager.getText('commands.blacklistword.list_title', lang)
            )
            .setDescription(
                LanguageManager.getText(
                    'commands.blacklistword.list_description',
                    lang,
                    { count: blacklistedWords.length }
                )
            )
            .setFooter({
                text: LanguageManager.getText(
                    'commands.blacklistword.page_info',
                    lang,
                    { page, totalPages }
                ),
            })
            .setTimestamp();

        pageWords.forEach((wordData) => {
            const status = wordData.enabled ? '✅' : '❌';
            const caseSensitive = wordData.caseSensitive ? '✅' : '❌';
            const deleteMsg = wordData.deleteMessage ? '✅' : '❌';
            const warnUser = wordData.warnUser ? '✅' : '❌';

            const useContextAnalysis = wordData.useContextAnalysis ? '✅' : '❌';
            const contextThreshold = wordData.contextThreshold || 0.2;

            embed.addFields({
                name: `${status} ${wordData.word}`,
                value: LanguageManager.getText(
                    'commands.blacklistword.word_info',
                    lang,
                    {
                        addedBy: wordData.addedByUsername,
                        caseSensitive,
                        deleteMessage: deleteMsg,
                        warnUser,
                        useContextAnalysis,
                        contextThreshold: (contextThreshold * 100).toFixed(0) + '%',
                        reason:
              wordData.reason ||
              LanguageManager.getText('commands.blacklistword.no_reason', lang),
                    }
                ),
                inline: false,
            });
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('blacklistword_prev_page')
                .setLabel(
                    LanguageManager.getText('commands.blacklistword.previous_page', lang)
                )
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page <= 1),
            new ButtonBuilder()
                .setCustomId('blacklistword_next_page')
                .setLabel(
                    LanguageManager.getText('commands.blacklistword.next_page', lang)
                )
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page >= totalPages)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error('Error listing blacklisted words:', error);
        await interaction.reply({
            content: LanguageManager.getText(
                'commands.global_strings.error_occurred',
                lang,
                { error: error.message }
            ),
            flags: [MessageFlags.Ephemeral],
        });
    }
}

async function handleToggleWord(client, interaction, lang) {
    const word = interaction.options.getString('word');

    try {
        const wordData = await client
            .getDatabaseHandler()
            .findOne('blacklistedWords', {
                guild: interaction.guildId,
                word: word.toLowerCase(),
            });

        if (!wordData) {
            return interaction.reply({
                content: LanguageManager.getText(
                    'commands.blacklistword.word_not_found',
                    lang,
                    { word }
                ),
                flags: [MessageFlags.Ephemeral],
            });
        }

        const newStatus = !wordData.enabled;
        await client
            .getDatabaseHandler()
            .updateOne(
                'blacklistedWords',
                { guild: interaction.guildId, word: word.toLowerCase() },
                { enabled: newStatus }
            );

        const embed = new EmbedBuilder()
            .setColor(newStatus ? 0x00ff00 : 0xff0000)
            .setTitle(
                LanguageManager.getText('commands.blacklistword.toggle_title', lang)
            )
            .setDescription(
                LanguageManager.getText(
                    'commands.blacklistword.toggle_description',
                    lang,
                    {
                        word,
                        status: newStatus
                            ? LanguageManager.getText('commands.blacklistword.enabled', lang)
                            : LanguageManager.getText(
                                'commands.blacklistword.disabled',
                                lang
                            ),
                    }
                )
            )
            .addFields({
                name: LanguageManager.getText(
                    'commands.blacklistword.fields.toggled_by',
                    lang
                ),
                value: interaction.user.username,
                inline: true,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log the action if logging is enabled
        const guildSettings = await client
            .getDatabaseHandler()
            .findOne('settings', { guild: interaction.guildId });
        if (guildSettings?.enableLogging && guildSettings?.logChannel) {
            const logChannel = client.channels.cache.get(guildSettings.logChannel);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(newStatus ? 0x00ff00 : 0xff0000)
                    .setTitle(
                        LanguageManager.getText(
                            'logging.blacklisted_word_toggled.title',
                            lang
                        )
                    )
                    .setDescription(
                        LanguageManager.getText(
                            'logging.blacklisted_word_toggled.description',
                            lang,
                            {
                                word,
                                username: interaction.user.username,
                                status: newStatus
                                    ? LanguageManager.getText(
                                        'logging.blacklisted_word_toggled.enabled',
                                        lang
                                    )
                                    : LanguageManager.getText(
                                        'logging.blacklisted_word_toggled.disabled',
                                        lang
                                    ),
                            }
                        )
                    )
                    .addFields(
                        {
                            name: LanguageManager.getText(
                                'logging.blacklisted_word_toggled.fields.toggled_by',
                                lang
                            ),
                            value: `${interaction.user.username} (${interaction.user.id})`,
                            inline: true,
                        },
                        {
                            name: LanguageManager.getText(
                                'logging.blacklisted_word_toggled.fields.channel',
                                lang
                            ),
                            value: interaction.channel.name,
                            inline: true,
                        }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    } catch (error) {
        console.error('Error toggling blacklisted word:', error);
        await interaction.reply({
            content: LanguageManager.getText(
                'commands.global_strings.error_occurred',
                lang,
                { error: error.message }
            ),
            flags: [MessageFlags.Ephemeral],
        });
    }
}
