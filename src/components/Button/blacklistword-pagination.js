const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const Component = require('../../structure/Component');
const LanguageManager = require('../../utils/LanguageManager');

module.exports = new Component({
    customId: ['blacklistword_prev_page', 'blacklistword_next_page'],
    type: 'button',
    run: async (client, interaction) => {
        try {
            const guildSettings = await client
                .getDatabaseHandler()
                .findOne('settings', {
                    guild: interaction.guildId,
                });
            const lang = guildSettings?.language || 'en';

            if (!interaction.member.permissions.has('ManageMessages')) {
                return interaction.reply({
                    content: LanguageManager.getText(
                        'commands.global_strings.no_permission',
                        lang
                    ),
                    ephemeral: true,
                });
            }

            const isNextPage = interaction.customId === 'blacklistword_next_page';
            const currentEmbed = interaction.message.embeds[0];
            const footerText = currentEmbed.footer?.text || '';
            
            const pageMatch = footerText.match(/Page (\d+) of (\d+)/);
            if (!pageMatch) {
                return interaction.reply({
                    content: 'Invalid pagination state.',
                    ephemeral: true,
                });
            }

            let currentPage = parseInt(pageMatch[1]);
            const totalPages = parseInt(pageMatch[2]);

            if (isNextPage) {
                currentPage = Math.min(currentPage + 1, totalPages);
            } else {
                currentPage = Math.max(currentPage - 1, 1);
            }

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
                    ephemeral: true,
                });
            }

            const wordsPerPage = 10;
            const startIndex = (currentPage - 1) * wordsPerPage;
            const endIndex = startIndex + wordsPerPage;
            const pageWords = blacklistedWords.slice(startIndex, endIndex);

            const newEmbed = new EmbedBuilder()
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
                        { page: currentPage, totalPages }
                    ),
                })
                .setTimestamp();

            pageWords.forEach((wordData) => {
                const status = wordData.enabled ? '✅' : '❌';
                const caseSensitive = wordData.caseSensitive ? '✅' : '❌';
                const deleteMsg = wordData.deleteMessage ? '✅' : '❌';
                const warnUser = wordData.warnUser ? '✅' : '❌';
                const useContextAnalysis = wordData.useContextAnalysis ? '✅' : '❌';
                const contextThreshold = wordData.contextThreshold || 1.0;

                newEmbed.addFields({
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
                LanguageManager.getText(
                    'commands.blacklistword.no_reason',
                    lang
                ),
                        }
                    ),
                    inline: false,
                });
            });

            const newRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('blacklistword_prev_page')
                    .setLabel(
                        LanguageManager.getText(
                            'commands.blacklistword.previous_page',
                            lang
                        )
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage <= 1),
                new ButtonBuilder()
                    .setCustomId('blacklistword_next_page')
                    .setLabel(
                        LanguageManager.getText('commands.blacklistword.next_page', lang)
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage >= totalPages)
            );

            await interaction.update({ embeds: [newEmbed], components: [newRow] });

        } catch (error) {
            console.error('Error handling blacklist word pagination:', error);
            await interaction.reply({
                content: 'An error occurred while updating the page.',
                ephemeral: true,
            });
        }
    },
});
