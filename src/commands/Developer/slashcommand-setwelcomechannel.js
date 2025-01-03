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
        type: 1, options: [
            {
                name: 'channel',
                description: 'Select the channel to set as welcome channel.',
                type: ApplicationCommandOptionType.Channel,
                required: true,
            }
        ],
    },
    options: {}
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */,
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        let settings = client.database.get("settings") || [];
        let guildSettings = settings.find(setting => setting.guild === interaction.guild.id);

        if (!guildSettings) {
            guildSettings = {guild: interaction.guild.id};
            settings.push(guildSettings);
        }

        if (ensureGuildSettings(guildSettings)) {
            client.database.set("settings", settings);
        }

        guildSettings.welcomeChannel = channel.id;

        await interaction.reply({
            content: `The welcome channel has been set to <#${channel.id}>.`,
            ephemeral: true,
        });
        try {
            client.database.set("settings", settings);
        } catch (error) {
            console.error(`Failed to set the welcome channel due to: ${error.message}.`);
        }
    },
}).toJSON();