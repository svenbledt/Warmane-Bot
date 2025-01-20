const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "language",
    description: "Set the bot's language for this server",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "language",
        description: "Choose the language",
        type: 3, // STRING type
        required: true,
        choices: [
          {
            name: "English",
            value: "en",
          },
          {
            name: "Deutsch",
            value: "de",
          },
          {
            name: "Русский",
            value: "ru",
          },
          {
            name: "Français",
            value: "fr",
          },
          {
            name: "Español",
            value: "es",
          },
        ],
      },
    ],
  },
  options: {},
  run: async (client, interaction) => {
    const newLanguage = interaction.options.getString("language");
    let settings = client.database.get("settings") || [];
    let guildSettings = settings.find(
      (setting) => setting.guild === interaction.guildId
    );

    // Get current language for error message
    const currentLang = guildSettings?.language || "en";

    if (
      !interaction.member.permissions.has([
        PermissionsBitField.Flags.BanMembers,
      ])
    ) {
      await interaction.reply({
        content: LanguageManager.getText('commands.language.no_permission', currentLang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (!guildSettings) {
      guildSettings = {
        guild: interaction.guildId,
        language: "en",
      };
      settings.push(guildSettings);
    }

    guildSettings.language = newLanguage;
    client.database.set("settings", settings);

    const languageNames = {
      en: "English",
      de: "Deutsch",
      ru: "Русский",
      fr: "Français",
      es: "Español",
    };

    // Use the new language for success message
    await interaction.reply({
      content: LanguageManager.getText('commands.language.success', newLanguage, {
        language: languageNames[newLanguage]
      }),
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();
