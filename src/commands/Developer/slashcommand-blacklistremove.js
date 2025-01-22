const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist-remove",
    description: "Remove someone from the Global blacklist.",
    type: 1,
    contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "user",
        description: "The user to remove from the blacklist",
        type: ApplicationCommandOptionType.User,
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
    let obj = client.database.get("blacklisted") || [];
    const user = interaction.options.getUser("user");

    // Check if the user is in the blacklist
    if (!obj.some((u) => u.id === user.id)) {
      await interaction.reply({
        content: "The user is not in the blacklist.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Remove the user from the blacklist
    obj = obj.filter((u) => u.id !== user.id);
    client.database.set("blacklisted", obj);

    // Get all guilds the bot is in
    const guilds = client.guilds.cache;
    let unbanCount = 0;
    let failCount = 0;

    // Try to unban from each guild
    await Promise.all(guilds.map(async (guild) => {
      try {
        // Check if bot has ban permissions
        const botMember = guild.members.cache.get(client.user.id);
        if (!botMember?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          failCount++;
          return;
        }

        // Try to unban the user
        await guild.bans.remove(user.id, 'Removed from global blacklist')
          .then(() => {
            unbanCount++;
          })
          .catch((error) => {
            // If error is not "Unknown Ban", count as fail
            if (error.code !== 10026) { // 10026 is "Unknown Ban" error code
              failCount++;
            }
            // If "Unknown Ban", we just ignore it as the user wasn't banned here
          });

      } catch (error) {
        console.error(`Failed to unban user in guild ${guild.name}:`, error);
        failCount++;
      }
    }));

    await interaction.reply({
      content: `User ${user} has been removed from the global blacklist.\n\nUnban Statistics:\n• Successfully unbanned in ${unbanCount} servers\n• Failed to unban in ${failCount} servers\n• (Servers where the user wasn't banned are not counted in the statistics)`,
      flags: [MessageFlags.Ephemeral],
    });
  },
}).toJSON();
