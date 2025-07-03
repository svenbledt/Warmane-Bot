const {
    MessageFlags,
    EmbedBuilder,
} = require('discord.js');
const Component = require('../../structure/Component');
const config = require('../../config');
const LanguageManager = require('../../utils/LanguageManager');

module.exports = new Component({
    customId: 'report-modal-id',
    type: 'modal',
    /**
   *
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
    run: async (client, interaction) => {
        const field1 = interaction.fields.getTextInputValue(
            'report-modal-id-field-1'
        );
        
        // Check if field1 is a valid Discord user ID
        const reportedUserMention = field1.match(/^\d+$/) ? `<@${field1}>` : field1;

        const field2 = interaction.fields.getTextInputValue(
            'report-modal-id-field-2'
        );
        const field3 = interaction.fields.getTextInputValue(
            'report-modal-id-field-3'
        );

        // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        // Tell the interaction user that the report has been submitted.
        await interaction.reply({
            content: LanguageManager.getText('commands.report.submitted', lang),
            flags: [MessageFlags.Ephemeral],
        });

        // Send the report to the Server's Moderation channel.
        const channel = client.channels.cache.get(config.development.reportChannel);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle(LanguageManager.getText('commands.report.report_title', lang))
                .addFields(
                    { name: LanguageManager.getText('commands.report.reported_user', lang), value: reportedUserMention, inline: true },
                    { name: LanguageManager.getText('commands.report.reason', lang), value: field2 },
                    { name: LanguageManager.getText('commands.report.evidence', lang), value: field3 },
                    { name: LanguageManager.getText('commands.report.reporter_id', lang), value: `<@${interaction.user.id}>` }
                )
                .setFooter({
                    text: LanguageManager.getText('commands.report.submitted_by', lang, { user: interaction.user.tag }),
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor('#5A002C');

            await channel.send({ embeds: [embed] });
        } else {
            console.error(LanguageManager.getText('commands.report.send_failed', lang));
        }
    },
});
