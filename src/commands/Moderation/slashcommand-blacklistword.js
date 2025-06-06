const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');
const { error } = require('../../utils/Console');

// Helper functions
async function getGuildLanguage(client, guildId) {
    const guildSettings = await client.getDatabaseHandler().findOne('settings', {
        guild: guildId,
    });
    return guildSettings?.language || 'en';
}

async function handleAddCommand(client, interaction, lang) {
    const word = interaction.options.getString('word');
    const points = interaction.options.getInteger('points');
    const reason = interaction.options.getString('reason');

    if (points >= 0) {
        return interaction.editReply({
            content: LanguageManager.getText('commands.blacklistword.points_must_be_negative', lang),
            flags: [MessageFlags.Ephemeral],
        });
    }

    const blacklistedWordsHandler = client.getBlacklistedWordsHandler();
    await blacklistedWordsHandler.addWord(word, points, interaction.user.id, reason);

    await interaction.editReply({
        content: LanguageManager.getText('commands.blacklistword.add_success', lang, {
            word: word,
            points: points
        }),
        flags: [MessageFlags.Ephemeral],
    });
}

async function handleRemoveCommand(client, interaction, lang) {
    const word = interaction.options.getString('word');
    const blacklistedWordsHandler = client.getBlacklistedWordsHandler();
    
    await blacklistedWordsHandler.removeWord(word);
    
    await interaction.editReply({
        content: LanguageManager.getText('commands.blacklistword.remove_success', lang, {
            word: word
        }),
        flags: [MessageFlags.Ephemeral],
    });
}

async function handleListCommand(client, interaction, lang) {
    const blacklistedWordsHandler = client.getBlacklistedWordsHandler();
    const words = await blacklistedWordsHandler.getAllWords();

    if (words.length === 0) {
        return interaction.editReply({
            content: LanguageManager.getText('commands.blacklistword.no_words', lang),
            flags: [MessageFlags.Ephemeral],
        });
    }

    const wordList = words.map(w => 
        LanguageManager.getText('commands.blacklistword.word_entry', lang, {
            word: w.word,
            points: w.points,
            addedBy: `<@${w.addedBy}>`,
            reason: w.reason
        })
    ).join('\n');

    await interaction.editReply({
        content: LanguageManager.getText('commands.blacklistword.list_header', lang) + '\n' + wordList,
        flags: [MessageFlags.Ephemeral],
    });
}

async function validatePermissions(interaction, lang) {
    const isDeveloper = config.users?.developers?.includes(interaction.user.id);
    const hasPermissions = interaction.member.permissions.has([
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ModerateMembers,
    ]);

    if (!isDeveloper && !hasPermissions) {
        await interaction.editReply({
            content: LanguageManager.getText('commands.global_strings.no_permission', lang),
            flags: [MessageFlags.Ephemeral],
        });
        return false;
    }

    return true;
}

module.exports = new ApplicationCommand({
    command: {
        name: 'blacklistword',
        description: 'Manage blacklisted words',
        type: 1,
        options: [
            {
                name: 'add',
                description: 'Add a word to the blacklist',
                type: 1,
                options: [
                    {
                        name: 'word',
                        description: 'The word to blacklist',
                        type: 3,
                        required: true
                    },
                    {
                        name: 'points',
                        description: 'Points to deduct (negative number)',
                        type: 4,
                        required: true
                    },
                    {
                        name: 'reason',
                        description: 'Reason for blacklisting',
                        type: 3,
                        required: true
                    }
                ]
            },
            {
                name: 'remove',
                description: 'Remove a word from the blacklist',
                type: 1,
                options: [
                    {
                        name: 'word',
                        description: 'The word to remove',
                        type: 3,
                        required: true
                    }
                ]
            },
            {
                name: 'list',
                description: 'List all blacklisted words',
                type: 1
            }
        ],
        contexts: [0, 2] // 0 = Guild, 2 = PrivateChannel
    },
    options: {
        cooldown: 5000
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const lang = await getGuildLanguage(client, interaction.guildId);

        try {
            if (!await validatePermissions(interaction, lang)) {
                return;
            }

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
            case 'add':
                await handleAddCommand(client, interaction, lang);
                break;
            case 'remove':
                await handleRemoveCommand(client, interaction, lang);
                break;
            case 'list':
                await handleListCommand(client, interaction, lang);
                break;
            }
        } catch (err) {
            error('Error in blacklistword command:', err);
            await interaction.editReply({
                content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
                    error: err.message
                }),
                flags: [MessageFlags.Ephemeral],
            });
        }
    }
}); 