const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "charlist",
    description: "List all characters assigned to a user",
    type: 1,
    contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "user",
        description: "The user to list characters for",
        type: ApplicationCommandOptionType.User,
        required: false,
      }
    ],
  },
  options: {
    cooldown: 5000,
  },
  run: async (client, interaction) => {
    // Get target user (defaults to command user if not specified)
    const targetUser = interaction.options.getUser("user") || interaction.user;

    // Get guild settings for language
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || "en";

    // Get user characters data
    const userChars = client.database.get("userCharacters") || {};
    const userData = userChars[targetUser.id];

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(LanguageManager.getText('commands.charlist.embed.title', lang, {
        username: targetUser.username
      }))
      .setTimestamp();

    if (!userData || (!userData.main && (!userData.alts || userData.alts.length === 0))) {
      embed.setDescription(LanguageManager.getText('commands.charlist.embed.no_characters', lang));
    } else {
      let description = "";

      if (userData.main) {
        description += LanguageManager.getText('commands.charlist.embed.main_character', lang, {
          name: userData.main.name,
          realm: userData.main.realm
        }) + "\n\n";
      }

      if (userData.alts && userData.alts.length > 0) {
        description += LanguageManager.getText('commands.charlist.embed.alt_characters_header', lang) + "\n";
        userData.alts.forEach(alt => {
          description += LanguageManager.getText('commands.charlist.embed.character_entry', lang, {
            name: alt.name,
            realm: alt.realm
          }) + "\n";
        });
      }

      embed.setDescription(description);
    }

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  }
}).toJSON();
