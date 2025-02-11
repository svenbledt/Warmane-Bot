const {
    MessageFlags,
    EmbedBuilder,
} = require('discord.js');
const Component = require('../../structure/Component');
const config = require('../../config');

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

        // Tell the interaction user that the report has been submitted.
        await interaction.reply({
            content:
        'Your report has been submitted. Thank you for helping us keep the server safe.',
            flags: [MessageFlags.Ephemeral],
        });

        // Send the report to the Server's Moderation channel.
        const channel = client.channels.cache.get(config.development.reportChannel);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('User Report')
                .addFields(
                    { name: 'Reported User', value: reportedUserMention, inline: true },
                    { name: 'Reason', value: field2 },
                    { name: 'Evidence', value: field3 },
                    { name: 'ReporterID', value: `<@${interaction.user.id}>` }
                )
                .setFooter({
                    text: 'Report submitted by ' + interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor('#5A002C');

            await channel.send({ embeds: [embed] });
        } else {
            console.error('Failed to send the report to the Moderation channel.');
        }
    },
});
