const {
    MessageFlags,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: "blacklist-add",
        description: "Add someone to the Global blacklist.",
        type: 1,
        options: [
            {
                name: "id",
                description: "The ID of the user to blacklist.",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "reason",
                description: "The reason for blacklisting the user.",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    options: {
        botDevelopers: true,
    },
    run: async (client, interaction) => {
        let obj = client.database.get("blacklisted") || [];

        let addId = interaction.options.getString("id");
        let reason = interaction.options.getString("reason");

        // Check if the addId is a mention
        if (addId && addId.startsWith('<@') && addId.endsWith('>')) {
            // Extract the ID from the mention
            addId = addId.slice(2, -1);

            // Remove the '!' if the mention is for a user with a nickname
            if (addId.startsWith('!')) {
                addId = addId.slice(1);
            }
        }

        if (addId) {
            // Check if the ID is already in the blacklist
            if (obj.some(user => user.id === addId)) {
                await interaction.reply({
                    content: "The user is already in the blacklist.",
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }
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
                        flags: [MessageFlags.Ephemeral],
                    });
                    return;
                }
                // Reply to the interaction
                try {
                    await interaction.reply({
                        content: "I have blacklisted the user.",
                        flags: [MessageFlags.Ephemeral],
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
                    flags: [MessageFlags.Ephemeral],
                });
            }

            obj.push({ id: addId, reason: reason });
            client.database.set("blacklisted", obj);
        } else {
            await interaction.reply({
                content:
                    "You must provide a user ID to blacklist.",
                flags: [MessageFlags.Ephemeral],
            });
        }
    },
}).toJSON();