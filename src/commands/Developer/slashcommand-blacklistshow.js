const {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: "blacklist-show",
        description: "Blacklist or unblacklist someone from the Guild.",
        type: 1,
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
        if (obj.length === 0) {
            await interaction.reply({
                content: `There are no blacklisted users.`,
                ephemeral: true,
            });
            return;
        }
        // Send embed message wich displays all blacklisted users
        const embed = new EmbedBuilder() // Create a new embed
            .setTitle("Blacklisted Users") // Set the title
            .setColor("#C41E3A"); // Set the color to red
        obj.forEach((id) => { // Loop through each blacklisted user
            embed.addFields({name: "User ID", value: id}); // Add a field with the user ID
        });
        try {
            interaction.reply({embeds: [embed], ephemeral: true}); // Send the embed as a reply
        } catch (error) {
            console.error(`Failed to send the blacklist embed.`);
            await interaction.reply({
                content: `Failed to send the blacklist embed.`,
                ephemeral: true,
            });
            return;
        }
    },
}).toJSON();
