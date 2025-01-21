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
    description: "Change the language of the bot for this server.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "language",
        description: "Select the language you want to use.",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "English", value: "en" },
          { name: "Deutsch", value: "de" },
          { name: "Русский", value: "ru" },
          { name: "Français", value: "fr" },
          { name: "Español", value: "es" },
        ],
      },
    ],
  },
  options: {
    cooldown: 5000,
  },
  run: async (client, interaction) => {
    // Get current guild settings
    const settings = client.database.get("settings") || [];
    const currentLang = settings.find(setting => setting.guild === interaction.guildId)?.language || 'en';

    if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.no_permission', currentLang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const newLanguage = interaction.options.getString("language", true);
    
    // Update or create guild settings
    const guildIndex = settings.findIndex(setting => setting.guild === interaction.guildId);
    if (guildIndex !== -1) {
      settings[guildIndex].language = newLanguage;
    } else {
      settings.push({
        guild: interaction.guildId,
        language: newLanguage
      });
    }
    client.database.set("settings", settings);

    const languageNames = {
      en: "English",
      de: "Deutsch",
      ru: "Русский",
      fr: "Français",
      es: "Español",
    };

    await interaction.reply({
      content: LanguageManager.getText('commands.language.success', newLanguage, {
        language: languageNames[newLanguage]
      }),
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();
