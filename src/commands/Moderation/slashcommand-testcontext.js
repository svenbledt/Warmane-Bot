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
                contextThreshold: 0.2
            };

            const analysis = contextAnalyzer.analyzeContext(testMessage, testWord, mockWordData);

            const embed = new EmbedBuilder()
                .setColor(analysis.isAppropriate ? 0x00ff00 : 0xff0000)
                .setTitle('🔍 Context Analysis Test')
                .setDescription(`Testing word: **${testWord}**`)
                .addFields(
                    { name: '📝 Test Message', value: testMessage.length > 1024 ? testMessage.substring(0, 1021) + '...' : testMessage, inline: false },
                    { name: '🎯 Result', value: analysis.isAppropriate ? '✅ **Appropriate Usage**' : '❌ **Inappropriate Usage**', inline: true },
                    { name: '📊 Confidence', value: `${(analysis.confidence * 100).toFixed(1)}%`, inline: true },
                    { name: '⚖️ Threshold', value: `${(mockWordData.contextThreshold * 100).toFixed(0)}%`, inline: true }
                )
                .setTimestamp();

            if (analysis.context) {
                embed.addFields({
                    name: '🔍 Context Around Word',
                    value: `"...${analysis.context}..."`,
                    inline: false
                });
            }

            if (analysis.reasoning.length > 0) {
                const reasoningText = analysis.reasoning.slice(0, 5).join('\n');
                embed.addFields({
                    name: '💭 Analysis Reasoning',
                    value: reasoningText + (analysis.reasoning.length > 5 ? '\n*...and more*' : ''),
                    inline: false
                });
            }

            const wouldTakeAction = analysis.confidence < mockWordData.contextThreshold;
            embed.addFields({
                name: '🤖 Bot Action',
                value: wouldTakeAction ? '🚫 **Would take action** (delete/warn)' : '✅ **Would allow message**',
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