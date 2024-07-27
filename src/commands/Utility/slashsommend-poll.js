const {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
    PollLayoutType
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'poll',
        description: 'Create a poll with the given options',
        type: 1,
        options: [
            {
                name: 'question',
                description: 'What u want to ask the community.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'duration',
                description: 'How long the poll should last. (in hours)',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: 'answer1',
                description: 'Give the first answer for the poll.',
                type: ApplicationCommandOptionType.String,
                required: true,

            },
            {
                name: 'answer2',
                description: 'Give the second answer for the poll.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'answer3',
                description: 'Give the third answer for the poll.',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'answer4',
                description: 'Give the fourth answer for the poll.',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'Multi-Choice',
                description: 'Allow users to select multiple answers.',
                type: ApplicationCommandOptionType.Boolean,
            }
        ]
    },
    options: {
        botDevelopers: true
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if (!interaction.guild) return interaction.reply('This command can only be used in a server.');
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers])) {
            await interaction.reply({
                content: `You don't have the required permissions to use this command.`,
                ephemeral: true,
            });
            return;
        }

        const question = interaction.options.getString('question', true);
        const duration = interaction.options.getInteger('duration', true);
        const answer1 = interaction.options.getString('answer1', true);
        const answer2 = interaction.options.getString('answer2', false);
        const answer3 = interaction.options.getString('answer3', false);
        const answer4 = interaction.options.getString('answer4', false);
        const multiChoice = interaction.options.getBoolean('Multi-Choice', false);

        const answers = [
            { label: answer1, emoji: '🔴' },
            { label: answer2, emoji: '🔵' },
            { label: answer3, emoji: '🟢' },
            { label: answer4, emoji: '🟡' }
        ];

        // Check if any answer exceeds 55 characters
        for (const answer of answers) {
            if (answer.label && answer.label.length > 55) {
                await interaction.reply({
                    content: `One of the answers exceeds the 55 character limit: "${answer.label}"`,
                    ephemeral: true
                });
                return;
            }
        }

        // Filter out empty answers
        const filteredAnswers = answers.filter(answer => answer.label);

        try {
            await interaction.channel.send({
                poll: {
                    question: question,
                    duration: duration,
                    answers: filteredAnswers,
                    multiChoice: multiChoice,
                    layoutType: PollLayoutType.Default
                }
            });
        } catch (error) {
            console.error(`Failed to send a poll to the channel.`);
            await interaction.reply({
                content: `Failed to send a poll to the channel.`,
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            content: `Poll created!`,
            ephemeral: true
        });
    }
}).toJSON();