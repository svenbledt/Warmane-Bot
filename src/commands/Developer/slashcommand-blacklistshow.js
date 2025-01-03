const {
    MessageFlags,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: "blacklist-show",
        description: "Shows the global Blacklist.",
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
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }
        // Create an array to hold your embeds
        let embeds = [];
        // Split your data into chunks of 25 and create an embed for each chunk
        for (let i = 0; i < obj.length; i += 25) {
            const current = obj.slice(i, i + 25);
            const embed = new EmbedBuilder()
                .setTitle("Blacklisted Users")
                .setColor("#C41E3A")
                .setThumbnail("https://i.imgur.com/VlVw8JK.png")
                .setFooter({text:`Page ${embeds.length + 1} of ${Math.ceil(obj.length / 25)}`, iconURL: client.user.displayAvatarURL()});
            current.forEach((member) => {
                embed.addFields({
                    name: "Blacklisted User",
                    value: `ID: <@${member.id}>\nReason: ${member.reason}`
                });
            });
            embeds.push(embed);
        }
// Create the buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(embeds.length === 1), // Disable if only one page
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(embeds.length === 1), // Disable if only one page
            );
        // Send the first embed and the buttons
        let message = await interaction.reply({embeds: [embeds[0]], components: [row], fetchReply: true});
        // Create a collector to listen for button clicks
        const filter = i => i.customId === 'previous' || i.customId === 'next';
        const collector = message.createMessageComponentCollector({filter, time: 60000});
        let currentPage = 0;
        collector.on('collect', async (interaction) => {
            // Ensure the interaction is from the same user
            if (interaction.user.id !== message.user.id) {
                return interaction.reply({content: 'These buttons are not for you!', flags: [MessageFlags.Ephemeral]});
            }
            // Update the current page number based on the button that was clicked
            if (interaction.customId === 'previous') {
                currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
            } else {
                currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
            }
            // Update the message to show the new page
            await interaction.update({embeds: [embeds[currentPage]]});
        });
        collector.on('end', async () => {
            // Delete the original message
            await message.delete();

            // Send a new message with the same content but without the buttons
            await interaction.channel.send({embeds: [embeds[currentPage]]});
        });
    },
}).toJSON();