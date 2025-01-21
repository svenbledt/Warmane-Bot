const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
  PollLayoutType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "poll",
    description: "Create a poll with the given options",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "question",
        description: "What u want to ask the community.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "duration",
        description: "How long the poll should last. (in hours)",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: "answer1",
        description: "Give the first answer for the poll.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "answer2",
        description: "Give the second answer for the poll.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "answer3",
        description: "Give the third answer for the poll.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "answer4",
        description: "Give the fourth answer for the poll.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "pin",
        description: "Pin the poll to the channel.",
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
      {
        name: "multichoice",
        description: "Allow multiple choices.",
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
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
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    if (!interaction.guild) {
      return interaction.reply({
        content: LanguageManager.getText('commands.global_strings.guild_only', lang),
        flags: [MessageFlags.Ephemeral],
      });
    }
    if (
      !interaction.member.permissions.has([
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.BanMembers,
      ])
    ) {
      await interaction.reply({
        content: `You don't have the required permissions to use this command.`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const question = interaction.options.getString("question");
    if (!question) {
      await interaction.reply({
        content: LanguageManager.getText('commands.poll.question_missing', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const duration = interaction.options.getInteger("duration");
    const pin = interaction.options.getBoolean("pin") ?? false;
    const multiChoice = interaction.options.getBoolean("multichoice") ?? false;

    // Filter and validate answers
    const answers = [];
    for (let i = 1; i <= 4; i++) {
      const answer = interaction.options.getString(`answer${i}`);
      if (answer) {
        if (answer.length > 55) {
          await interaction.reply({
            content: LanguageManager.getText('commands.poll.answer_too_long', lang, {
              answer: answer
            }),
            flags: [MessageFlags.Ephemeral],
          });
          return;
        }
        answers.push(answer);
      }
    }

    if (answers.length < 2) {
      await interaction.reply({
        content: LanguageManager.getText('commands.poll.min_answers', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Filter question and answers for safety
    const filteredQuestion = question.replace(/[^\w\s.,!?]/g, "");
    const filteredAnswers = answers.map((answer) =>
      answer.replace(/[^\w\s.,!?]/g, "")
    );

    try {
      const pollMessage = await interaction.channel.send({
        poll: {
          question: filteredQuestion,
          duration: duration,
          answers: filteredAnswers,
          allowMultiselect: multiChoice,
          layoutType: PollLayoutType.Default,
        },
      });

      if (pin) {
        await pollMessage.pin();
      }

      await interaction.reply({
        content: LanguageManager.getText(
          pin ? 'commands.poll.created_pinned' : 'commands.poll.created', 
          lang
        ),
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error(`Failed to send a poll to the channel: ${error.message}`);
      await interaction.reply({
        content: LanguageManager.getText('commands.poll.creation_failed', lang, {
          error: error.message
        }),
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
}).toJSON();
