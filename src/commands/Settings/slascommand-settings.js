const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",  // Add default language setting
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
    lastOwnerDM: {},
    // Add any other default settings here
  };

  let updated = false;

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!guildSettings.hasOwnProperty(key)) {
      guildSettings[key] = value;
      updated = true;
    }
  }

  return updated;
}

module.exports = new ApplicationCommand({
  command: {
    name: "settings",
    description: "Toggle settings for the server.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "toggle",
        description: "Select the realm of the character.",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "WelcomeMessage", value: "welcomeMessage" },
          { name: "CharNameAsk", value: "CharNameAsk" },
          { name: "BlockList", value: "BlockList" },
        ],
      },
    ],
  },
  options: {},
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */ run: async (client, interaction) => {
    if (!interaction.member) {
      await interaction.reply({
        content: "Could not verify member permissions.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (!interaction.member.permissions) {
      await interaction.reply({
        content: "Could not verify member permissions.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (
      !interaction.member.permissions.has([
        PermissionsBitField.Flags.Administrator,
      ])
    ) {
      await interaction.reply({
        content: "You need to be an administrator to use this command.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const settingName = interaction.options.getString("toggle");
    let settings = client.database.get("settings") || [];

    let guildSettings = settings.find(
      (setting) => setting.guild === interaction.guild.id
    );
    if (!guildSettings) {
      guildSettings = { guild: interaction.guild.id };
      settings.push(guildSettings);
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }

    if (guildSettings[settingName]) {
      guildSettings[settingName] = false;
      await interaction.reply({
        content: `The setting ${settingName} has been disabled.`,
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      guildSettings[settingName] = true;
      await interaction.reply({
        content: `The setting ${settingName} has been enabled.`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    try {
      client.database.set("settings", settings);
    } catch (error) {
      console.error(
        `Failed to save the settings to the database due to: ${error.message}.`
      );
    }
  },
}).toJSON();
