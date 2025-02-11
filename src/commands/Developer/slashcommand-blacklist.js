/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');

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
        name: 'blacklist',
        description: 'Manage global blacklist',
        type: 1,
        options: [
            {
                name: 'check',
                description: 'Check and manage blacklisted users across servers',
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'show',
                description: 'Show the global blacklist',
                type: ApplicationCommandOptionType.Subcommand
            }
        ],
    },
    options: {
        botDevelopers: true,
    },
    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        if (subcommand === 'check') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            try {
                // Only allow this in the Warmane Tool Discord
                if (interaction.guildId !== config.development.guildId) {
                    await interaction.editReply({
                        content: 'This command can only be used in the Warmane Tool Discord server.',
                    });
                    return;
                }

                // Get all blacklisted users
                const blacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
                if (!blacklistedUsers || blacklistedUsers.length === 0) {
                    await interaction.editReply({
                        content: LanguageManager.getText('commands.globalcheck.no_blacklisted', lang),
                    });
                    return;
                }

                // Create embeds for each blacklisted user (5 per page)
                let embeds = [];
                for (let i = 0; i < blacklistedUsers.length; i += 5) {
                    const embed = new EmbedBuilder()
                        .setTitle('Global Blacklist Overview')
                        .setColor('#C41E3A')
                        .setDescription('These users are currently blacklisted across all servers.');

                    const pageUsers = blacklistedUsers.slice(i, i + 5);
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
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(embeds.length === 1),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(embeds.length === 1)
                );

                // Create action buttons
                const actionRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('unban')
                        .setLabel('Unban Selected')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('add_blacklist')
                        .setLabel('Add to Blacklist')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('refresh')
                        .setLabel('Refresh List')
                        .setStyle(ButtonStyle.Secondary)
                );

                // Send initial embed
                await interaction.editReply({
                    embeds: [embeds[0]],
                    components: [row, actionRow],
                });

                let currentPage = 0;
                const message = await interaction.fetchReply();

                // Create collector for buttons and modals
                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === interaction.user.id,
                    time: 300000, // 5 minutes
                });

                // Add modal submit handler at the interaction level
                const modalHandler = async (modalInteraction) => {
                    if (modalInteraction.customId === 'blacklist_add_modal') {
                        await modalInteraction.deferReply({ flags: [MessageFlags.Ephemeral] });
              
                        const userId = modalInteraction.fields.getTextInputValue('userId');
                        const reason = modalInteraction.fields.getTextInputValue('reason');

                        try {
                            // Validate user ID
                            const user = await client.users.fetch(userId);

                            // Check if user is already blacklisted
                            const existingBlacklist = await client.getDatabaseHandler().findOne('blacklisted', { id: userId });
                            if (existingBlacklist) {
                                await modalInteraction.editReply({
                                    content: 'This user is already blacklisted.',
                                });
                                return;
                            }

                            // Add user to blacklist
                            await client.getDatabaseHandler().updateOne(
                                'blacklisted',
                                { id: userId },
                                { $set: { id: userId, reason: reason } },
                                { upsert: true }
                            );

                            // Ban user from all guilds
                            const guilds = client.guilds.cache;
                            let banCount = 0;
                            let failCount = 0;
                            let notFoundCount = 0;

                            await Promise.all(guilds.map(async (guild) => {
                                try {
                                    const botMember = guild.members.cache.get(client.user.id);
                                    if (!botMember?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                                        failCount++;
                                        return;
                                    }

                                    const member = await guild.members.fetch(userId).catch(() => null);
                                    if (!member) {
                                        notFoundCount++;
                                        return;
                                    }

                                    if (member.roles.highest.position >= botMember.roles.highest.position) {
                                        failCount++;
                                        return;
                                    }

                                    await guild.members.ban(userId, {
                                        reason: `Global Blacklist: ${reason}`,
                                        deleteMessageSeconds: 60 * 60 * 24 * 7
                                    });
                                    banCount++;
                                } catch (error) {
                                    failCount++;
                                    console.error(`Failed to ban user in guild ${guild.name}:`, error);
                                }
                            }));

                            // Refresh the blacklist display
                            const freshBlacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
                            embeds = [];
                
                            // Recreate embeds with fresh data
                            for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
                                const embed = new EmbedBuilder()
                                    .setTitle('Global Blacklist Overview')
                                    .setColor('#C41E3A')
                                    .setDescription('These users are currently blacklisted across all servers.');

                                const pageUsers = freshBlacklistedUsers.slice(i, i + 5);
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

                            // Update the original message with new data
                            await interaction.editReply({
                                embeds: [embeds[0]],
                                components: [row, actionRow]
                            });

                            // Send confirmation in modal response
                            await modalInteraction.editReply({
                                content: `User ${user.tag} has been added to the global blacklist.\nReason: ${reason}\n\nBan Statistics:\n• Successfully banned in ${banCount} servers\n• Failed to ban in ${failCount} servers\n• User not found in ${notFoundCount} servers\n• Skipped Warmane Tool Discord server to allow appeals`,
                            });
                        } catch (error) {
                            console.error('Error adding user to blacklist:', error);
                            await modalInteraction.editReply({
                                content: 'Failed to add user to blacklist. Please ensure the user ID is valid.',
                            });
                        }
                    }
                };

                // Add modal submit listener
                interaction.client.on('interactionCreate', async (interaction) => {
                    if (interaction.isModalSubmit()) {
                        await modalHandler(interaction);
                    }
                });

                collector.on('collect', async (i) => {
                    try {
                        if (i.customId === 'previous') {
                            currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
                            await i.update({ embeds: [embeds[currentPage]] });
                        }
                        else if (i.customId === 'next') {
                            currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
                            await i.update({ embeds: [embeds[currentPage]] });
                        }
                        else if (i.customId === 'refresh') {
                            // Reload the blacklist and recreate embeds
                            const freshBlacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
                            embeds = []; // Reset embeds
                
                            // Recreate embeds with fresh data
                            for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
                                const embed = new EmbedBuilder()
                                    .setTitle('Global Blacklist Overview')
                                    .setColor('#C41E3A')
                                    .setDescription('These users are currently blacklisted across all servers.');

                                const pageUsers = freshBlacklistedUsers.slice(i, i + 5);
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
                                    .setTitle('Global Blacklist Overview')
                                    .setColor('#C41E3A')
                                    .setDescription('No users are currently blacklisted.')],
                                components: embeds.length > 0 ? [row, actionRow] : []
                            });
                        }
                        else if (i.customId === 'unban') {
                            try {
                                // Acknowledge the interaction immediately
                                await i.deferUpdate();

                                // Get fresh data
                                const freshBlacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
                  
                                // Get users from current page using fresh data
                                const pageUsers = freshBlacklistedUsers.slice(currentPage * 5, (currentPage * 5) + 5);
                  
                                // Create select menu with users from current page
                                const selectMenu = new StringSelectMenuBuilder()
                                    .setCustomId('unban_select')
                                    .setPlaceholder('Select a user to unban')
                                    .setMinValues(1)
                                    .setMaxValues(1);

                                // Add options for each user on the current page
                                for (const user of pageUsers) {
                                    selectMenu.addOptions({
                                        label: `User ID: ${user.id}`,
                                        description: `Reason: ${user.reason?.substring(0, 90) || 'No reason provided'}`,
                                        value: user.id
                                    });
                                }

                                const selectRow = new ActionRowBuilder().addComponents(selectMenu);

                                // Update with the select menu
                                await i.editReply({
                                    embeds: [], // Remove the embeds
                                    content: pageUsers.length > 0 ? 'Select a user to unban:' : 'No users to unban on this page.',
                                    components: pageUsers.length > 0 ? [selectRow] : []
                                });
                            } catch (error) {
                                console.error('Error in unban button handler:', error);
                                await i.editReply({
                                    content: 'An error occurred while processing your request.',
                                    components: []
                                }).catch(console.error);
                            }
                        }
                        else if (i.customId === 'unban_select') {
                            try {
                                await i.deferUpdate();
                                const selectedId = i.values[0];
                  
                                // Remove user from blacklist
                                await client.getDatabaseHandler().deleteOne('blacklisted', { id: selectedId });

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
                                        await guild.bans.remove(selectedId, 'Removed from global blacklist')
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

                                // Refresh the blacklist display
                                const freshBlacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
                                embeds = []; // Reset embeds
                  
                                // Recreate embeds with fresh data
                                for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
                                    const embed = new EmbedBuilder()
                                        .setTitle('Global Blacklist Overview')
                                        .setColor('#C41E3A')
                                        .setDescription('These users are currently blacklisted across all servers.');

                                    const pageUsers = freshBlacklistedUsers.slice(i, i + 5);
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

                                // Return to the main view with updated data and unban statistics
                                await i.editReply({
                                    content: `Successfully removed user ${selectedId} from the blacklist.\n\nUnban Statistics:\n• Successfully unbanned in ${unbanCount} servers\n• Failed to unban in ${failCount} servers\n• (Servers where the user wasn't banned are not counted in the statistics)`,
                                    embeds: embeds.length > 0 ? [embeds[0]] : [new EmbedBuilder()
                                        .setTitle('Global Blacklist Overview')
                                        .setColor('#C41E3A')
                                        .setDescription('No users are currently blacklisted.')],
                                    components: embeds.length > 0 ? [row, actionRow] : []
                                });
                            } catch (error) {
                                console.error('Error in unban select handler:', error);
                                await i.editReply({
                                    content: 'An error occurred while processing your request.',
                                    components: []
                                }).catch(console.error);
                            }
                        }
                        else if (i.customId === 'add_blacklist') {
                            // Create and show modal
                            const modal = new ModalBuilder()
                                .setCustomId('blacklist_add_modal')
                                .setTitle('Add User to Blacklist');

                            const userIdInput = new TextInputBuilder()
                                .setCustomId('userId')
                                .setLabel('User ID')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Enter the user ID')
                                .setRequired(true);

                            const reasonInput = new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel('Reason')
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder('Enter the reason for blacklisting')
                                .setRequired(true);

                            const firstRow = new ActionRowBuilder().addComponents(userIdInput);
                            const secondRow = new ActionRowBuilder().addComponents(reasonInput);

                            modal.addComponents(firstRow, secondRow);
                            await i.showModal(modal);
                        }
                    } catch (error) {
                        console.error('Error handling button interaction:', error);
                    }
                });

                collector.on('end', async () => {
                    try {
                        await interaction.editReply({
                            components: []
                        });
                    } catch (error) {
                        console.error('Error removing components:', error);
                    }
                });

            } catch (err) {
                console.error('Error in blacklist check command:', err);
                await interaction.editReply({
                    content: '❌ An error occurred while checking the blacklist.',
                });
            }
        }

        else if (subcommand === 'show') {
            try {
                await interaction.deferReply();

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
                        .setThumbnail('./../assets/blacklist.png')
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
                console.error('Error in blacklist show command:', error);
                const reply = interaction.replied ? interaction.editReply : interaction.reply;
                await reply.call(interaction, {
                    content: 'An error occurred while showing the blacklist.',
                    flags: [MessageFlags.Ephemeral]
                });
            }
        }
    },
}); 