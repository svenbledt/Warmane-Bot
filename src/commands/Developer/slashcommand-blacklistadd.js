const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist-add",
    description: "Adds a user to the global blacklist.",
    type: 1,
    contexts: [0, 2],
    options: [
      {
        name: "user",
        description: "The user to blacklist",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for the blacklist",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  options: {
    botDevelopers: true,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    let obj = client.database.get("blacklisted") || [];
    if (obj.some((u) => u.id === user.id)) {
      await interaction.reply({
        content: "This user is already blacklisted.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Add user to blacklist
    obj.push({
      id: user.id,
      reason: reason,
    });
    client.database.set("blacklisted", obj);

    // Get all guilds the bot is in
    const guilds = client.guilds.cache;
    let banCount = 0;
    let failCount = 0;
    let notFoundCount = 0;
    let skippedCount = 0;

    // Check each guild for the blacklisted user
    await Promise.all(guilds.map(async (guild) => {
      try {
        // Skip the Warmane Tool Discord server
        if (guild.id === config.development.guildId) {
          skippedCount++;
          return;
        }

        // Check if bot has ban permissions
        const botMember = guild.members.cache.get(client.user.id);
        if (!botMember?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          failCount++;
          return;
        }

        // Try to fetch the member
        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          notFoundCount++;
          return;
        }

        // Check if the bot can ban this member
        if (member.roles.highest.position >= botMember.roles.highest.position) {
          console.log(`Failed to ban user in guild ${guild.name} because the bot cannot ban this member.`);
          failCount++;
          return;
        }

        // Ban the member
        await guild.members.ban(user.id, {
          reason: `Global Blacklist: ${reason}`,
          deleteMessageSeconds: 60 * 60 * 24 * 7 // 7 days of messages
        });
        banCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to ban user in guild ${guild.name}:`, error);
      }
    }));

    // Send response with statistics
    await interaction.reply({
      content: `User <@${user.id}> has been added to the global blacklist.\nReason: ${reason}\n\nBan Statistics:\n• Successfully banned in ${banCount} servers\n• Failed to ban in ${failCount} servers\n• User not found in ${notFoundCount} servers\n• Skipped Warmane Tool Discord server to allow appeals`,
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();
