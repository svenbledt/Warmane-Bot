const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
  ChannelType
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "set-logchannel",
    description: "Set the channel for server logs",
    type: 1,
    contexts: [0],
    options: [
      {
        name: "channel",
        description: "The channel where logs should be sent",
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
    ],
  },
  options: {
    botDevelopers: true,
    cooldown: 5000,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const channel = interaction.options.getChannel("channel", true);
    let settings = client.database.get("settings") || [];
    let guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || "en";

    // Check if user has admin permissions
    if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.no_permission', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Check if channel is a text channel
    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: LanguageManager.getText('commands.setlogchannel.invalid_channel', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Create or update guild settings
    if (!guildSettings) {
      guildSettings = { guild: interaction.guildId };
      settings.push(guildSettings);
    }

    // Update log channel
    guildSettings.logChannel = channel.id;
    
    // Enable logging if it wasn't already enabled
    if (!guildSettings.enableLogging) {
      guildSettings.enableLogging = true;
      await interaction.reply({
        content: LanguageManager.getText('commands.setlogchannel.success_with_enable', lang, {
          channelName: channel.name
        }),
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: LanguageManager.getText('commands.setlogchannel.success', lang, {
          channelName: channel.name
        }),
        flags: [MessageFlags.Ephemeral],
      });
    }

    client.database.set("settings", settings);
  },
}).toJSON(); 