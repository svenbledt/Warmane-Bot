const {
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
    name: "set-welcome-message-dm",
    description: "Sets the welcome message for DMs.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "text",
        description:
          "Set the message to send when a member joins and ask for their character name.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  options: {},
  /**
   * Executes the command.
   * @param {DiscordBot} client - The Discord bot client.
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   */
  run: async (client, interaction) => {
    // Check if the user has the required permissions to run this command
    if (
      !interaction.member.permissions.has([
        PermissionsBitField.Flags.Administrator,
      ])
    ) {
      await interaction.reply({
        content: `You don't have the required permissions to use this command.`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Get the guild settings
    let settings = client.database.get("settings") || [];
    let guildSettings = settings.find(
      (setting) => setting.guild === interaction.guild.id
    );

    // If the guild settings do not exist, create them
    if (!guildSettings) {
      guildSettings = { guild: interaction.guild.id };
      settings.push(guildSettings);
      ensureGuildSettings(guildSettings); // Populate default settings immediately
    } else {
      // Ensure the guild settings are up to date
      if (ensureGuildSettings(guildSettings)) {
        client.database.set("settings", settings);
      }
    }

    // Get the welcome message from the interaction options
    const charNameAskDM = interaction.options.getString("text");
    if (!guildSettings.CharNameAsk) {
      // if the welcome message is not enabled, dont continue
      await interaction.reply({
        content: "The welcome DM is not enabled.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
    // Update the welcome message in the guild settings
    guildSettings.charNameAskDM = charNameAskDM;

    // Save the updated settings to the database
    client.database.set("settings", settings);

    // Reply to the interaction to confirm the update
    await interaction.reply({
      content: "The welcome message has been updated.",
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();
