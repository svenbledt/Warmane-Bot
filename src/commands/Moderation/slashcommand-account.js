const {
    MessageFlags,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
    EmbedBuilder
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");


module.exports = new ApplicationCommand({
    command: {
        name: "account",
        description: "Check the account of a user and display some information about it.",
        type: 1,
        contexts: [0],
        options: [
            {
                name: "user",
                description: "The user to check the account of.",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    options: {
        cooldown: 5000,
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const user = interaction.options.getUser("user", true);
        const member = interaction.guild.members.cache.get(user.id);

        // Get guild settings for language
        const guildSettings = await client.database_handler.findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';
        const isDeveloper = config.users?.developers?.includes(interaction.user.id);
        const hasPermissions = interaction.member.permissions.has([
          PermissionsBitField.Flags.KickMembers,
          PermissionsBitField.Flags.BanMembers,
        ]);

        if (!isDeveloper && !hasPermissions) {
            await interaction.editReply({
                content: LanguageManager.getText('commands.global_strings.no_permission', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        const t = (key) => LanguageManager.getText(`commands.account.embed.${key}`, lang);


        // Get account standing data
        const accountStanding = await client.database_handler.findOne('accountStanding', {
            user: user.id
        });

        // Get guild leveling progress
        const levelingProgress = await client.database_handler.findOne('levelingProgress', {
            guild: interaction.guildId,
            userId: user.id
        });

        const embed = new EmbedBuilder()
            .setColor(member?.displayColor || 0x0099FF)
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(t('description'))
            .addFields(
                {
                    name: t('fields.account_info_title'),
                    value: [
                        `**${t('fields.username')}:** ${user.username}`,
                        `**${t('fields.displayName')}:** ${member?.nickname || user.globalName || 'None'}`,
                        `**${t('fields.id')}:** ${user.id}`,
                        `**${t('fields.created')}:** <t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`,
                        member ? `**${t('fields.joined')}:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)` : ''
                    ].filter(Boolean).join('\n'),
                    inline: false
                },
                {
                    name: t('fields.activity_title'),
                    value: [
                        `**${t('fields.accountStanding')}:** ${getAccountStandingTier(accountStanding?.level || 1, t)}`,
                        `**${t('fields.accountLevel')}:** ${accountStanding?.level || 1}`,
                        `**${t('fields.accountXP')}:** ${accountStanding?.xp || 0}`,
                        `**${t('fields.xpProgress')}:** ${formatXPProgress(accountStanding?.xp || 0, accountStanding?.level || 1)}`,
                        `**${t('fields.voiceTime')}:** ${formatVoiceTime(accountStanding?.voiceTime || 0)}`,
                        '',
                        `**${t('fields.serverProgress')}:**`,
                        levelingProgress ? `┗ ${t('fields.serverLevel')}: ${levelingProgress.level}` : '┗ Not started',
                        levelingProgress ? `┗ ${t('fields.serverXP')}: ${levelingProgress.xp}` : ''
                    ].filter(Boolean).join('\n'),
                    inline: false
                }
            );

        // Add roles if member is in guild
        if (member) {
            const roles = member.roles.cache
                .filter(role => role.id !== interaction.guildId)
                .sort((a, b) => b.position - a.position);

            if (roles.size > 0) {
                embed.addFields({
                    name: t('fields.roles_title').replace('{count}', roles.size),
                    value: roles.map(role => `<@&${role.id}>`).join(', '),
                    inline: false
                });
            }
        }

        // Add badges/flags if any
        const userFlags = user.flags?.toArray();
        if (userFlags?.length) {
            embed.addFields({
                name: t('fields.badges_title'),
                value: userFlags.map(flag => `\`${flag}\``).join(', '),
                inline: false
            });
        }

        embed.setFooter({ 
            text: t('footer').replace('{guildName}', interaction.guild.name),
            iconURL: interaction.guild.iconURL({ dynamic: true })
        })
        .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
});

// Helper function to format voice time
function formatVoiceTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
        return `${minutes} minutes`;
    }
    return `${hours} hours, ${minutes} minutes`;
}

// Helper function to format account standing tier
function getAccountStandingTier(level, t) {
    if (level >= 50) return t('fields.tiers.veteran');
    if (level >= 30) return t('fields.tiers.diamond');
    if (level >= 20) return t('fields.tiers.gold');
    if (level >= 10) return t('fields.tiers.silver');
    return t('fields.tiers.bronze');
}

// Helper function to format XP progress
function formatXPProgress(currentXP, level) {
    const nextLevelXP = Math.floor(100 * level * 3);
    const percentage = Math.floor((currentXP / nextLevelXP) * 100);
    const progressBar = '▰'.repeat(Math.floor(percentage/10)) + '▱'.repeat(10 - Math.floor(percentage/10));
    return `${progressBar} (${percentage}%)`;
}