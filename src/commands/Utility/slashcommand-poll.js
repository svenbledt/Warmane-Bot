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
                name: 'multi-choice',
                description: 'Allow users to select multiple answers.',
                type: ApplicationCommandOptionType.Boolean,
            }
        ]
    },
    options: {
        botDevelopers: false,
        cooldown: 10000,
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
        const multiChoice = interaction.options.getBoolean('multi-choice', false);

        if (!question) {
            await interaction.reply({
                content: `Poll question is missing.`,
                ephemeral: true
            });
            return;
        }

        const answers = [
            { text: answer1, emoji: '🔴' },
            { text: answer2, emoji: '🔵' },
            { text: answer3, emoji: '🟢' },
            { text: answer4, emoji: '🟡' }
        ];

        // Check if any answer exceeds 55 characters
        for (const answer of answers) {
            if (answer.text && answer.text.length > 55) {
                await interaction.reply({
                    content: `One of the answers exceeds the 55 character limit: "${answer.text}"`,
                    ephemeral: true
                });
                return;
            }
        }

        // Filter out empty answers
        const filteredAnswers = answers.filter(answer => answer.text);
        const filteredQuestion = { text: question, emoji: '❓', attachment: null };
        if (filteredAnswers.length < 2) {
            await interaction.reply({
                content: `At least two answers are required.`,
                ephemeral: true
            });
            return;
        }

        try {
            await interaction.channel.send({
                poll: {
                    question: filteredQuestion,
                    duration: duration,
                    answers: filteredAnswers,
                    multiChoice: multiChoice,
                    layoutType: PollLayoutType.Default
                }
            });
        } catch (error) {
            console.error(`Failed to send a poll to the channel: ${error.message}`);
            await interaction.reply({
                content: `Failed to send a poll to the channel: ${error.message}`,
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