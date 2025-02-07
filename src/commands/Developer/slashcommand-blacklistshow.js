/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');

async function safeMessageDelete(message) {
    try {
        if (message && !message.ephemeral) {
            await message.delete().catch(error => {
                if (error.code !== 10008) {
                    console.error('Error deleting message:', error);
                }
            });
        }
    } catch (error) {
        if (error.code !== 10008) {
            console.error('Error in safeMessageDelete:', error);
        }
    }
}

module.exports = new ApplicationCommand({
    command: {
        name: 'blacklist-show',
        description: 'Shows the global Blacklist.',
        type: 1,
        contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
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
        try {
            // Defer the reply
            await interaction.deferReply();

            // Get blacklisted users from MongoDB
            const blacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
      
            if (!blacklistedUsers || blacklistedUsers.length === 0) {
                await interaction.editReply({
                    content: 'There are no blacklisted users.',
                });
                return;
            }

            // Create an array to hold your embeds
            const embeds = [];
            // Split your data into chunks of 25 and create an embed for each chunk
            for (let i = 0; i < blacklistedUsers.length; i += 25) {
                const current = blacklistedUsers.slice(i, i + 25);
                const embed = new EmbedBuilder()
                    .setTitle('Blacklisted Users')
                    .setColor('#C41E3A')
                    .setThumbnail('https://i.imgur.com/VlVw8JK.png')
                    .setFooter({
                        text: `Page ${embeds.length + 1} of ${Math.ceil(blacklistedUsers.length / 25)}`,
                        iconURL: client.user.displayAvatarURL(),
                    });

                current.forEach((member) => {
                    embed.addFields({
                        name: 'Blacklisted User',
                        value: `ID: <@${member.id}>\nReason: ${member.reason}`,
                    });
                });
                embeds.push(embed);
            }

            // Create the buttons
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(embeds.length === 1), // Disable if only one page
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(embeds.length === 1) // Disable if only one page
            );

            // Send the first embed and the buttons
            await interaction.editReply({ embeds: [embeds[0]], components: [row] });
            const message = await interaction.fetchReply();

            // Create a collector to listen for button clicks
            const collector = message.createMessageComponentCollector({
                filter: (i) => 
                    (i.customId === 'previous' || i.customId === 'next') && 
          i.user.id === interaction.user.id,
                time: 60000,
            });

            let currentPage = 0;
            collector.on('collect', async (i) => {
                try {
                    // Update the current page number based on the button that was clicked
                    if (i.customId === 'previous') {
                        currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
                    } else {
                        currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
                    }
          
                    // Update the message to show the new page
                    await i.update({ embeds: [embeds[currentPage]] });
                } catch (error) {
                    console.error('Error handling button interaction:', error);
                }
            });

            collector.on('end', async () => {
                try {
                    await safeMessageDelete(message);
                } catch (error) {
                    console.error('Error in collector end:', error);
                }
            });
        } catch (error) {
            console.error('Error in blacklist-show command:', error);
            const reply = interaction.replied ? interaction.editReply : interaction.reply;
            await reply.call(interaction, {
                content: 'An error occurred while showing the blacklist.',
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
});
