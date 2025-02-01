const {
  MessageFlags,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");

module.exports = new ApplicationCommand({
  command: {
    name: "blacklist-check",
    description: "Check all blacklisted users across servers (Developer Only)",
    type: 1,
    contexts: [0],
  },
  options: {
    botDevelopers: true,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Defer reply immediately
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    try {
      // Get guild settings for language
      const guildSettings = await client.database_handler.findOne('settings', {
        guild: interaction.guildId
      });
      const lang = guildSettings?.language || 'en';

      // Only allow this in the Warmane Tool Discord
      if (interaction.guildId !== config.development.guildId) {
        await interaction.editReply({
          content: "This command can only be used in the Warmane Tool Discord server.",
        });
        return;
      }

      // Get all blacklisted users
      const blacklistedUsers = await client.database_handler.find('blacklisted', {});
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
          .setTitle("Global Blacklist Overview")
          .setColor("#C41E3A")
          .setDescription("These users are currently blacklisted across all servers.");

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
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(embeds.length === 1),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(embeds.length === 1)
      );

      // Create action buttons
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("unban")
          .setLabel("Unban Selected")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("add_blacklist")
          .setLabel("Add to Blacklist")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("refresh")
          .setLabel("Refresh List")
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
            const existingBlacklist = await client.database_handler.findOne('blacklisted', { id: userId });
            if (existingBlacklist) {
              await modalInteraction.editReply({
                content: "This user is already blacklisted.",
              });
              return;
            }

            // Add user to blacklist
            await client.database_handler.updateOne(
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
            let skippedCount = 0;

            await Promise.all(guilds.map(async (guild) => {
              try {
                if (guild.id === config.development.guildId) {
                  skippedCount++;
                  return;
                }

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
            const freshBlacklistedUsers = await client.database_handler.find('blacklisted', {});
            embeds = [];
            
            // Recreate embeds with fresh data
            for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
              const embed = new EmbedBuilder()
                .setTitle("Global Blacklist Overview")
                .setColor("#C41E3A")
                .setDescription("These users are currently blacklisted across all servers.");

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
              content: "Failed to add user to blacklist. Please ensure the user ID is valid.",
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

      collector.on("collect", async (i) => {
        try {
          if (i.customId === "previous") {
            currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
            await i.update({ embeds: [embeds[currentPage]] });
          }
          else if (i.customId === "next") {
            currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
            await i.update({ embeds: [embeds[currentPage]] });
          }
          else if (i.customId === "refresh") {
            // Reload the blacklist and recreate embeds
            const freshBlacklistedUsers = await client.database_handler.find('blacklisted', {});
            embeds = []; // Reset embeds
            
            // Recreate embeds with fresh data
            for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
              const embed = new EmbedBuilder()
                .setTitle("Global Blacklist Overview")
                .setColor("#C41E3A")
                .setDescription("These users are currently blacklisted across all servers.");

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
                .setTitle("Global Blacklist Overview")
                .setColor("#C41E3A")
                .setDescription("No users are currently blacklisted.")],
              components: embeds.length > 0 ? [row, actionRow] : []
            });
          }
          else if (i.customId === "unban") {
            try {
              // Acknowledge the interaction immediately
              await i.deferUpdate();

              // Get fresh data
              const freshBlacklistedUsers = await client.database_handler.find('blacklisted', {});
              
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
                content: pageUsers.length > 0 ? "Select a user to unban:" : "No users to unban on this page.",
                components: pageUsers.length > 0 ? [selectRow] : []
              });
            } catch (error) {
              console.error('Error in unban button handler:', error);
              await i.editReply({
                content: "An error occurred while processing your request.",
                components: []
              }).catch(console.error);
            }
          }
          else if (i.customId === "unban_select") {
            try {
              await i.deferUpdate();
              const selectedId = i.values[0];
              
              // Remove user from blacklist
              await client.database_handler.deleteOne('blacklisted', { id: selectedId });

              // Refresh the blacklist display
              const freshBlacklistedUsers = await client.database_handler.find('blacklisted', {});
              embeds = []; // Reset embeds
              
              // Recreate embeds with fresh data
              for (let i = 0; i < freshBlacklistedUsers.length; i += 5) {
                const embed = new EmbedBuilder()
                  .setTitle("Global Blacklist Overview")
                  .setColor("#C41E3A")
                  .setDescription("These users are currently blacklisted across all servers.");

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

              // Return to the main view with updated data
              await i.editReply({
                content: `Successfully removed user ${selectedId} from the blacklist.`,
                embeds: embeds.length > 0 ? [embeds[0]] : [new EmbedBuilder()
                  .setTitle("Global Blacklist Overview")
                  .setColor("#C41E3A")
                  .setDescription("No users are currently blacklisted.")],
                components: embeds.length > 0 ? [row, actionRow] : []
              });
            } catch (error) {
              console.error('Error in unban select handler:', error);
              await i.editReply({
                content: "An error occurred while processing your request.",
                components: []
              }).catch(console.error);
            }
          }
          else if (i.customId === "add_blacklist") {
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

      collector.on("end", async () => {
        try {
          await interaction.editReply({
            components: []
          });
        } catch (error) {
          console.error('Error removing components:', error);
        }
      });
    } catch (err) {
      console.error('Error in blacklist-check command:', err);
      await interaction.editReply({
        content: '❌ An error occurred while checking the blacklist.',
      });
    }
  },
}).toJSON(); 