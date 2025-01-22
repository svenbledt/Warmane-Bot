const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

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
    name: "set-welcome-channel",
    description: "Sets the welcome channel.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "channel",
        description: "Select the channel to set as welcome channel.",
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
    ],
  },
  options: {},
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */ run: async (client, interaction) => {

    if (
      !interaction.member.permissions.has([
        PermissionsBitField.Flags.Administrator,
      ])
    ) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.no_permission', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
    // Get guild settings for language
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guild.id);
    const lang = guildSettings?.language || 'en';

    const channel = interaction.options.getChannel("channel");

    if (!guildSettings) {
      guildSettings = { guild: interaction.guild.id };
      settings.push(guildSettings);
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }

    guildSettings.welcomeChannel = channel.id;

    await interaction.reply({
      content: LanguageManager.getText('commands.setwelcomechannel.channel_set', lang, {
        channel: `<#${channel.id}>`
      }),
      flags: [MessageFlags.Ephemeral],
    });

    try {
      client.database.set("settings", settings);
    } catch (error) {
      console.error(`Failed to set the welcome channel due to: ${error.message}.`);
      await interaction.editReply({
        content: LanguageManager.getText('commands.setwelcomechannel.error', lang, {
          error: error.message
        }),
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
}).toJSON();
