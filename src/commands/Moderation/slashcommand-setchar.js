const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const config = require("../../config");

// Define an axios instance with rate limit
const https = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 4000,
});

module.exports = new ApplicationCommand({
  command: {
    name: "setchar",
    description: "Set a character for a user",
    type: 1,
    contexts: [0],
    options: [
      {
        name: "user",
        description: "The user to set the character for",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "character",
        description: "Character name",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "realm",
        description: "Character realm",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "Icecrown", value: "Icecrown" },
          { name: "Onyxia", value: "Onyxia" },
          { name: "Lordaeron", value: "Lordaeron" },
          { name: "Frostwolf", value: "Frostwolf" },
          { name: "Blackrock", value: "Blackrock" },
        ],
      },
      {
        name: "type",
        description: "Character type (main or alt)",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "Main Character", value: "main" },
          { name: "Alt Character", value: "alt" },
        ],
      },
    ],
  },
  options: {
    cooldown: 5000,
  },
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user", true);
    const charName = interaction.options.getString("character", true);
    const realm = interaction.options.getString("realm", true);
    const charType = interaction.options.getString("type", true);
    const isMain = charType === "main";
    
    // Get guild settings for language
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || "en";

    if (
        !interaction.member.permissions.has([
          PermissionsBitField.Flags.Administrator,
        ])
      ) {
        await interaction.reply({
          content: LanguageManager.getText(
            "commands.global_strings.no_permission",
            lang
          ),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }
    const charNameFormatted = charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();

    try {
      // Verify character exists on Warmane
      const response = await https.get(
        `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
      );
      
      if (!response.data || !response.data.name) {
        return interaction.reply({
          content: LanguageManager.getText('commands.setchar.char_not_exist', lang, {
            character: charNameFormatted
          }),
          flags: [MessageFlags.Ephemeral],
        });
      }

      // Get user characters data
      let userChars = client.database.get("userCharacters") || {};
      
      // Check if character is already assigned to someone
      for (const userId in userChars) {
        const userData = userChars[userId];
        // Check main character
        if (userData.main && 
            userData.main.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            userData.main.realm === realm) {
          return interaction.reply({
            content: LanguageManager.getText('commands.setchar.char_already_assigned', lang, {
              character: charNameFormatted,
              user: `<@${userId}>`
            }),
            flags: [MessageFlags.Ephemeral],
          });
        }
        // Check alt characters
        if (userData.alts && userData.alts.some(alt => 
            alt.name.toLowerCase() === charNameFormatted.toLowerCase() && 
            alt.realm === realm)) {
          return interaction.reply({
            content: LanguageManager.getText('commands.setchar.char_already_assigned', lang, {
              character: charNameFormatted,
              user: `<@${userId}>`
            }),
            flags: [MessageFlags.Ephemeral],
          });
        }
      }

      // Initialize user data if it doesn't exist
      if (!userChars[user.id]) {
        userChars[user.id] = {
          main: null,
          alts: []
        };
      }

      const charData = {
        name: charNameFormatted,
        realm: realm,
        addedBy: interaction.user.id,
        addedAt: new Date().toISOString()
      };

      if (isMain) {
        // Check if user already has a main character
        if (userChars[user.id].main) {
          return interaction.reply({
            content: LanguageManager.getText('commands.setchar.already_has_main', lang, {
              user: `<@${user.id}>`,
              character: userChars[user.id].main.name,
              realm: userChars[user.id].main.realm
            }),
            flags: [MessageFlags.Ephemeral],
          });
        }
        userChars[user.id].main = charData;
      } else {
        userChars[user.id].alts.push(charData);
      }

      client.database.set("userCharacters", userChars);

      return interaction.reply({
        content: LanguageManager.getText('commands.setchar.success_with_type', lang, {
          character: charNameFormatted,
          realm: realm,
          user: `<@${user.id}>`,
          type: isMain ? 'main' : 'alt'
        }),
        flags: [MessageFlags.Ephemeral],
      });

    } catch (error) {
      return interaction.reply({
        content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
          error: error.message
        }),
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
}).toJSON();
