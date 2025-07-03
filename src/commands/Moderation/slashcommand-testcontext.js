/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    PermissionsBitField,
    EmbedBuilder
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const WordContextAnalyzer = require('../../utils/WordContextAnalyzer');

module.exports = new ApplicationCommand({
    command: {
        name: 'testcontext',
        description: 'Test how the context analyzer would interpret a message with blacklisted words.',
        type: 1,
        contexts: [0],
        options: [
            {
                name: 'message',
                description: 'The message to test',
                type: 3,
                required: true,
                max_length: 1000
            },
            {
                name: 'word',
                description: 'The blacklisted word to test against',
                type: 3,
                required: true,
                max_length: 50
            }
        ]
    },
    options: {
        botDevelopers: false,
        cooldown: 5000
    },
    run: async (client, interaction) => {
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        if (!interaction.guild) {
            return interaction.reply({
                content: LanguageManager.getText('commands.global_strings.guild_only', lang),
                flags: [MessageFlags.Ephemeral]
            });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }

        const testMessage = interaction.options.getString('message');
        const testWord = interaction.options.getString('word');

        try {
            const contextAnalyzer = new WordContextAnalyzer();
            
            const mockWordData = {
                word: testWord,
                useContextAnalysis: true,
                contextThreshold: 1.0
            };

            const analysis = contextAnalyzer.analyzeContext(testMessage, testWord, mockWordData);

            const embed = new EmbedBuilder()
                .setColor(analysis.isAppropriate ? 0x00ff00 : 0xff0000)
                .setTitle(`🔍 ${LanguageManager.getText('commands.testcontext.title', lang)}`)
                .setDescription(LanguageManager.getText('commands.testcontext.description', lang, { word: testWord }))
                .addFields(
                    { name: `📝 ${LanguageManager.getText('commands.testcontext.test_message', lang)}`, value: testMessage.length > 1024 ? testMessage.substring(0, 1021) + '...' : testMessage, inline: false },
                    { name: `🎯 ${LanguageManager.getText('commands.testcontext.result', lang)}`, value: analysis.isAppropriate ? `✅ **${LanguageManager.getText('commands.testcontext.appropriate_usage', lang)}**` : `❌ **${LanguageManager.getText('commands.testcontext.inappropriate_usage', lang)}**`, inline: true },
                    { name: `📊 ${LanguageManager.getText('commands.testcontext.confidence', lang)}`, value: `${(analysis.confidence * 100).toFixed(1)}%`, inline: true },
                    { name: `⚖️ ${LanguageManager.getText('commands.testcontext.threshold', lang)}`, value: `${(mockWordData.contextThreshold * 100).toFixed(0)}%`, inline: true }
                )
                .setTimestamp();

            if (analysis.context) {
                embed.addFields({
                    name: `🔍 ${LanguageManager.getText('commands.testcontext.context_around_word', lang)}`,
                    value: `"...${analysis.context}..."`,
                    inline: false
                });
            }

            if (analysis.reasoning.length > 0) {
                const reasoningText = analysis.reasoning.slice(0, 5).join('\n');
                embed.addFields({
                    name: `💭 ${LanguageManager.getText('commands.testcontext.analysis_reasoning', lang)}`,
                    value: reasoningText + (analysis.reasoning.length > 5 ? `\n*${LanguageManager.getText('commands.testcontext.and_more', lang)}*` : ''),
                    inline: false
                });
            }

            const wouldTakeAction = analysis.confidence < mockWordData.contextThreshold;
            embed.addFields({
                name: `🤖 ${LanguageManager.getText('commands.testcontext.bot_action', lang)}`,
                value: wouldTakeAction ? `🚫 **${LanguageManager.getText('commands.testcontext.would_take_action', lang)}**` : `✅ **${LanguageManager.getText('commands.testcontext.would_allow_message', lang)}**`,
                inline: false
            });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error testing context:', error);
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.error_occurred', lang, { error: error.message }),
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
}); 