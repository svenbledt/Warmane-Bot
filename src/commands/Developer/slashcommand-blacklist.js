const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist",
    description: "Blacklist or unblacklist someone from the Guild.",
    type: 1,
    options: [
      {
        name: "add",
        description: "The ID of the user to blacklist.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "remove",
        description: "The ID of the user to remove from the blacklist.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  options: {
    botDevelopers: true,
  }
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */,
  run: async (client, interaction) => {
    let obj = client.database.get("blacklisted") || [];

    const addId = interaction.options.getString("add");
    const removeId = interaction.options.getString("remove");

    if (addId) {
      const member = interaction.guild.members.cache.get(addId);

      if (member) {
        // Send a message to the user on DM
        try {
          await member.send(
            "You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff."
          );
        } catch (error) {
          console.error(`Failed to send a DM to ${member.tag}.`);
          await interaction.reply({
            content: `Failed to send a DM to ${member.tag}.`,
            ephemeral: true,
          });
          return;
        }
        // Reply to the interaction
        try {
          await interaction.reply({
            content: "I have blacklisted the user.",
            ephemeral: true,
          });
        } catch (error) {
          console.error(`Failed to reply to the interaction.`);
          return;
        }
        // Kick the user from the Guild
        try {
          await member.kick("User has been blacklisted from the Guild.");
        } catch (error) {
          console.error(`Failed to kick ${member.tag}.`);
          return;
        }
      } else {
        await interaction.reply({
          content:
            "The provided ID does not correspond to a member of the guild. I have added the ID to the blacklist.",
          ephemeral: true,
        });
      }

      obj.push(addId);
      client.database.set("blacklisted", obj);
    } else if (removeId) {
      // Remove the user from the blacklist
      obj = obj.filter((id) => id !== removeId);
      client.database.set("blacklisted", obj);

      await interaction.reply({
        content: "I have removed the user from the blacklist.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "You must provide either a user ID to blacklist or an ID to remove from the blacklist.",
        ephemeral: true,
      });
    }
  },
}).toJSON();
