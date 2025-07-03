/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');

module.exports = new ApplicationCommand({
    command: {
        name: 'globalcheck',
        description: 'Checks the current members of the guild for global blacklist entry\'s.',
        type: 1,
        contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    },
    options: {
        cooldown: 10000,
    },
    /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
    run: async (client, interaction) => {
    // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        // Check if user is a developer or has required permissions
        const isDeveloper = config.users?.developers?.includes(interaction.user.id);
        const hasPermissions = interaction.member.permissions.has([
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.BanMembers,
        ]);

        if (!isDeveloper && !hasPermissions) {
            await interaction.reply({
                content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        // Get blacklisted users from database
        const blacklistedUsers = await client.getDatabaseHandler().find('blacklisted', {});
        if (!blacklistedUsers || blacklistedUsers.length === 0) {
            await interaction.reply({
                content: LanguageManager.getText('commands.globalcheck.no_blacklisted', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        // Check the existing members of the guild for blacklisted users
        const members = await interaction.guild.members.fetch();
        const blacklistedMembers = [];
        members.forEach((member) => {
            if (blacklistedUsers.some((user) => user.id === member.id)) {
                blacklistedMembers.push(member);
            }
        });

        if (blacklistedMembers.length === 0) {
            await interaction.reply({
                content: LanguageManager.getText('commands.globalcheck.no_blacklisted_guild', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        // Create action buttons
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('kick')
                .setLabel(LanguageManager.getText('commands.globalcheck.BUTTONS.KICK', lang))
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('ban')
                .setLabel(LanguageManager.getText('commands.globalcheck.BUTTONS.BAN', lang))
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('nothing')
                .setLabel(LanguageManager.getText('commands.globalcheck.BUTTONS.NOTHING', lang))
                .setStyle(ButtonStyle.Primary)
        );

        // Create embeds for each blacklisted member (5 per page)
        const embeds = [];
        for (let i = 0; i < blacklistedMembers.length; i += 5) {
            const embed = new EmbedBuilder()
                .setTitle(LanguageManager.getText('commands.globalcheck.embed_title', lang))
                .setColor('#C41E3A');

            const pageMembers = blacklistedMembers.slice(i, i + 5);
            pageMembers.forEach((member) => {
                const blacklistedUser = blacklistedUsers.find((user) => user.id === member.id);
                embed.addFields({
                    name: '\u200B',
                    value: LanguageManager.getText('commands.globalcheck.blacklisted_user', lang, {
                        userId: member.id,
                        reason: blacklistedUser.reason
                    })
                });
            });
            embeds.push(embed);
        }

        // Create navigation buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel(LanguageManager.getText('commands.globalcheck.navigation.previous', lang))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(embeds.length === 1),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel(LanguageManager.getText('commands.globalcheck.navigation.next', lang))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(embeds.length === 1)
        );

        // Send the first embed with action buttons
        await interaction.reply({ 
            embeds: [embeds[0]], 
            components: [row, actionRow],
            flags: [MessageFlags.Ephemeral]
        });
        const message = await interaction.fetchReply();

        // Create collectors for both navigation and action buttons
        const filter = i => {
            const validButtons = ['previous', 'next', 'kick', 'ban', 'nothing'];
            return validButtons.includes(i.customId) && i.user.id === interaction.user.id;
        };

        const collector = message.createMessageComponentCollector({
            filter,
            time: 60000,
        });

        let currentPage = 0;
        let actionTaken = false;

        collector.on('collect', async (i) => {
            // Handle navigation buttons
            if (i.customId === 'previous' || i.customId === 'next') {
                if (i.customId === 'previous') {
                    currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
                } else {
                    currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
                }
                await i.update({ 
                    embeds: [embeds[currentPage]],
                    components: actionTaken ? [row] : [row, actionRow]
                });
                return;
            }

            // Handle action buttons
            if (['kick', 'ban', 'nothing'].includes(i.customId)) {
                actionTaken = true;
                let successCount = 0;
                let failCount = 0;

                if (i.customId === 'nothing') {
                    await i.update({ 
                        content: LanguageManager.getText('commands.globalcheck.ACTION_RESULTS.NOTHING', lang),
                        components: [row]
                    });
                    return;
                }

                // Process kick/ban action
                for (const member of blacklistedMembers) {
                    try {
                        if (i.customId === 'kick') {
                            await member.kick(`Global Blacklist Check - Kicked by ${interaction.user.tag}`);
                            successCount++;
                        } else if (i.customId === 'ban') {
                            await member.ban({
                                reason: `Global Blacklist Check - Banned by ${interaction.user.tag}`,
                                deleteMessageSeconds: 60 * 60 * 24 * 7 // 7 days
                            });
                            successCount++;
                        }
                    } catch (error) {
                        console.error(`Failed to ${i.customId} member ${member.user.tag}:`, error);
                        failCount++;
                    }
                }

                // Update message with results
                const actionResult = i.customId === 'kick' ? 
                    LanguageManager.getText('commands.globalcheck.ACTION_RESULTS.KICKED', lang, { COUNT: successCount }) :
                    LanguageManager.getText('commands.globalcheck.ACTION_RESULTS.BANNED', lang, { COUNT: successCount });

                const failResult = failCount > 0 ? 
                    `\n${LanguageManager.getText('commands.globalcheck.ACTION_RESULTS.FAILED', lang, { COUNT: failCount })}` : 
                    '';

                await i.update({ 
                    content: actionResult + failResult,
                    components: [row]
                });
            }
        });

        collector.on('end', async () => {
            if (interaction.replied) {
                await interaction.editReply({
                    embeds: [embeds[currentPage]],
                    components: [],
                });
            }
        });
    },
});
