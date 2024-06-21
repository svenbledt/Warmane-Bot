const {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: "globalcheck",
        description: "Checks the current members of the guild for global blacklist entry's.",
        type: 1,
    },
    options: {
        cooldown: 10000,
    }
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */,
    run: async (client, interaction) => {
        // check if the user has ban permission on the guild
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers])) {
            await interaction.reply({
                content: `You don't have the required permissions to use this command.`,
                ephemeral: true,
            });
            return;
        }
        let obj = client.database.get("blacklisted") || [];
        if (obj.length === 0) {
            await interaction.reply({
                content: `There are no blacklisted users.`,
                ephemeral: true,
            });
            return;
        }
        // Check the existing members of the guild for blacklisted users
        const members = await interaction.guild.members.fetch();
        let blacklistedMembers = [];
        members.forEach((member) => {
            if (obj.some(user => user.id === member.id)) {
                blacklistedMembers.push(member);
            }
        });
        if (blacklistedMembers.length === 0) {
            await interaction.reply({
                content: `There are no blacklisted users in the guild.`,
                ephemeral: true,
            });
            return;
        }
        // Send embed message wich displays all blacklisted users
        const embed = new EmbedBuilder() // Create a new embed
            .setTitle("Blacklisted Users") // Set the title
            .setColor("#C41E3A"); // Set the color to red
        blacklistedMembers.forEach((member) => { // Loop through each blacklisted user
            const blacklistedUser = obj.find(user => user.id === member.id);
            embed.addFields({name: "User", value: `<@${member.id}>`, inline:true}); // Add a field with the user ID
            embed.addFields({name: "Reason", value: blacklistedUser.reason, inline:true}); // Add a field with the reason
        });
        try {
            interaction.reply({embeds: [embed], ephemeral: true}); // Send the embed as a reply
        } catch (error) {
            console.error(`Failed to send the blacklist embed.`);
            await interaction.reply({
                content: `Failed to send the blacklist embed.`,
                ephemeral: true,
            });
        }
        // Let the user decide if they want to remove the blacklisted users from the guild
    },
}).toJSON();
