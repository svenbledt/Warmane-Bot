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
      welcomeMessageDM:
        "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
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
      const welcomeMessageDM = interaction.options.getString("text");
      
      // Update the welcome message in the guild settings
      guildSettings.welcomeMessageDM = welcomeMessageDM;
      
      // Save the updated settings to the database
      client.database.set("settings", settings);
  
      // Reply to the interaction to confirm the update
      await interaction.reply({
        content: "The welcome message has been updated.",
        ephemeral: true,
      });
    },
  }).toJSON();