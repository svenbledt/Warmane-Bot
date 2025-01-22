const {
  MessageFlags,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist-check",
    description: "Check all blacklisted users across servers (Developer Only)",
    type: 1,
    contexts: [0],
  },
  options: {
    botDevelopers: true,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Get guild settings for language
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    // Only allow this in the Warmane Tool Discord
    if (interaction.guildId !== config.development.guildId) {
      await interaction.reply({
        content: "This command can only be used in the Warmane Tool Discord server.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    let obj = client.database.get("blacklisted") || [];
    if (obj.length === 0) {
      await interaction.reply({
        content: LanguageManager.getText('commands.globalcheck.no_blacklisted', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Create embeds for each blacklisted user (5 per page)
    let embeds = [];
    for (let i = 0; i < obj.length; i += 5) {
      const embed = new EmbedBuilder()
        .setTitle("Global Blacklist Overview")
        .setColor("#C41E3A")
        .setDescription("These users are currently blacklisted across all servers.");

      const pageUsers = obj.slice(i, i + 5);
      for (const blacklistedUser of pageUsers) {
        try {
          const user = await client.users.fetch(blacklistedUser.id);
          embed.addFields({
            name: `${user.tag} (${user.id})`,
            value: `Reason: ${blacklistedUser.reason || 'No reason provided'}`
          });
        } catch (error) {
          embed.addFields({
            name: `Unknown User (${blacklistedUser.id})`,
            value: `Reason: ${blacklistedUser.reason || 'No reason provided'}`
          });
        }
      }
      embeds.push(embed);
    }

    // Create navigation buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(embeds.length === 1),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(embeds.length === 1)
    );

    // Create action buttons
    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("unban")
        .setLabel("Unban Selected")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("refresh")
        .setLabel("Refresh List")
        .setStyle(ButtonStyle.Secondary)
    );

    // Send initial embed
    await interaction.reply({
      embeds: [embeds[0]],
      components: [row, actionRow],
      flags: [MessageFlags.Ephemeral],
    });

    let currentPage = 0;
    const message = await interaction.fetchReply();

    // Create collector for buttons
    const collector = message.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 300000, // 5 minutes
    });

    collector.on("collect", async (i) => {
      if (i.customId === "previous") {
        currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
        await i.update({ embeds: [embeds[currentPage]] });
      }
      else if (i.customId === "next") {
        currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
        await i.update({ embeds: [embeds[currentPage]] });
      }
      else if (i.customId === "refresh") {
        // Reload the blacklist and recreate embeds
        obj = client.database.get("blacklisted") || [];
        embeds = []; // Reset embeds
        
        // Recreate embeds with fresh data
        for (let i = 0; i < obj.length; i += 5) {
          const embed = new EmbedBuilder()
            .setTitle("Global Blacklist Overview")
            .setColor("#C41E3A")
            .setDescription("These users are currently blacklisted across all servers.");

          const pageUsers = obj.slice(i, i + 5);
          for (const blacklistedUser of pageUsers) {
            try {
              const user = await client.users.fetch(blacklistedUser.id);
              embed.addFields({
                name: `${user.tag} (${user.id})`,
                value: `Reason: ${blacklistedUser.reason || 'No reason provided'}`
              });
            } catch (error) {
              embed.addFields({
                name: `Unknown User (${blacklistedUser.id})`,
                value: `Reason: ${blacklistedUser.reason || 'No reason provided'}`
              });
            }
          }
          embeds.push(embed);
        }

        currentPage = 0;
        await i.update({ 
          embeds: embeds.length > 0 ? [embeds[0]] : [new EmbedBuilder()
            .setTitle("Global Blacklist Overview")
            .setColor("#C41E3A")
            .setDescription("No users are currently blacklisted.")],
          components: embeds.length > 0 ? [row, actionRow] : []
        });
      }
      else if (i.customId === "unban") {
        // Create a selection menu with the users from the current page
        const selectRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("unban_confirm")
            .setLabel("Confirm Unban")
            .setStyle(ButtonStyle.Danger)
        );

        await i.update({
          content: "Please select a user to unban by clicking their entry in the embed, then click 'Confirm Unban'.",
          components: [selectRow]
        });
      }
    });

    collector.on("end", async () => {
      if (interaction.replied) {
        await interaction.editReply({
          components: []
        });
      }
    });
  },
}).toJSON(); 