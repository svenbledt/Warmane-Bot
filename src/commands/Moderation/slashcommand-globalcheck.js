const {
  MessageFlags,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "globalcheck",
    description: "Checks the current members of the guild for global blacklist entry's.",
    type: 1,
    contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
  },
  options: {
    cooldown: 10000,
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

    if (!interaction.member.permissions.has([
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.BanMembers,
    ])) {
      await interaction.reply({
        content: LanguageManager.getText('commands.global_strings.no_permission', lang),
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

    // Check the existing members of the guild for blacklisted users
    const members = await interaction.guild.members.fetch();
    let blacklistedMembers = [];
    members.forEach((member) => {
      if (obj.some((user) => user.id === member.id)) {
        blacklistedMembers.push(member);
      }
    });

    if (blacklistedMembers.length === 0) {
      await interaction.reply({
        content: LanguageManager.getText('commands.globalcheck.no_blacklisted_guild', lang),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Create embeds for each blacklisted member (5 per page)
    let embeds = [];
    for (let i = 0; i < blacklistedMembers.length; i += 5) {
      const embed = new EmbedBuilder()
        .setTitle(LanguageManager.getText('commands.globalcheck.embed_title', lang))
        .setColor("#C41E3A");

      const pageMembers = blacklistedMembers.slice(i, i + 5);
      pageMembers.forEach((member) => {
        const blacklistedUser = obj.find((user) => user.id === member.id);
        embed.addFields({
          name: "\u200B",
          value: LanguageManager.getText('commands.globalcheck.blacklisted_user', lang, {
            userId: member.id,
            reason: blacklistedUser.reason
          })
        });
      });
      embeds.push(embed);
    }

    // Create the buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(embeds.length === 1), // Disable if only one page
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(embeds.length === 1) // Disable if only one page
    );

    // Send the first embed and the buttons
    await interaction.reply({ embeds: [embeds[0]], components: [row] });
    let message = await interaction.fetchReply();

    // Create a collector to listen for button clicks
    const filter = (i) => i.customId === "previous" || i.customId === "next";
    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    let currentPage = 0;
    collector.on("collect", async (interaction) => {
      // Ensure the interaction is from the same user
      if (interaction.user.id !== message.user.id) {
        return interaction.reply({
          content: LanguageManager.getText('commands.globalcheck.not_for_you', lang),
          flags: [MessageFlags.Ephemeral],
        });
      }

      // Update the current page number based on the button that was clicked
      if (interaction.customId === "previous") {
        currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
      } else {
        currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
      }

      // Update the message to show the new page
      await interaction.update({ embeds: [embeds[currentPage]] });
    });

    collector.on("end", async () => {
      // Delete the original message
      await message.delete();
      // Send a new message with the same content but without the buttons
      await interaction.channel.send({ embeds: [embeds[currentPage]] });
    });
  },
}).toJSON();
