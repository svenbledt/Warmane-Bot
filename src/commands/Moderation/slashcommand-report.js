/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    PermissionsBitField,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');

module.exports = new ApplicationCommand({
    command: {
        name: 'report',
        description: 'Report a Warmane player for violating server rules. The player will be added to the global user blacklist and the report will be sent to the moderation team for review.',
        type: 1,
        contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
        options: [],
    },
    options: {
        botDevelopers: false,
        cooldown: 5000,
    },
    /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
    run: async (client, interaction) => {
    // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        if (!interaction.guild) {
            return interaction.reply({
                content: LanguageManager.getText('commands.global_strings.guild_only', lang),
                flags: [MessageFlags.Ephemeral],
            });
        }

        // check if the user has ban permission on the guild
        if (
            !interaction.member.permissions.has([
                PermissionsBitField.Flags.KickMembers,
                PermissionsBitField.Flags.BanMembers,
            ])
        ) {
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        await interaction.showModal({
            custom_id: 'report-modal-id',
            title: LanguageManager.getText('commands.report.modal.title', lang),
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'report-modal-id-field-1',
                            label: LanguageManager.getText('commands.report.modal.username_label', lang),
                            max_length: 20,
                            min_length: 2,
                            placeholder: LanguageManager.getText('commands.report.modal.username_placeholder', lang),
                            style: 1,
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'report-modal-id-field-2',
                            label: LanguageManager.getText('commands.report.modal.reason_label', lang),
                            max_length: 200,
                            min_length: 10,
                            placeholder: LanguageManager.getText('commands.report.modal.reason_placeholder', lang),
                            style: 2,
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'report-modal-id-field-3',
                            label: LanguageManager.getText('commands.report.modal.evidence_label', lang),
                            max_length: 45,
                            min_length: 2,
                            placeholder: LanguageManager.getText('commands.report.modal.evidence_placeholder', lang),
                            style: 1,
                            required: true,
                        },
                    ],
                },
            ],
        });
    },
});
