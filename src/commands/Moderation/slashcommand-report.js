const {MessageFlags, ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'report',
        description: 'Report a user for breaking the rules on Warmane.',
        type: 1,
        options: []
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
        if (!interaction.guild) return interaction.reply('This command can only be used in a server.');
        // check if the user has ban permission on the guild
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers])) {
            await interaction.reply({
                content: `You don't have the required permissions to use this command.`,
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }
        await interaction.showModal(
            {
                custom_id: 'report-modal-id',
                title: 'Report User',
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'report-modal-id-field-1',
                        label: 'Username of reported user?',
                        max_length: 15,
                        min_length: 2,
                        placeholder: 'Enter the username/discord id here!',
                        style: 1,
                        required: true
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'report-modal-id-field-2',
                        label: 'Reason',
                        max_length: 200,
                        min_length: 10,
                        placeholder: 'Enter the reason here!',
                        style: 2,
                        required: true
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'report-modal-id-field-3',
                        label: 'Provide your evidence.',
                        max_length: 45,
                        min_length: 2,
                        placeholder: 'https://imgur.com/blablabla!',
                        style: 1,
                        required: true
                    }]
                }]
            }
        )
    }
}).toJSON();