/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    ApplicationCommandOptionType,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const config = require('../../config');

module.exports = new ApplicationCommand({
    command: {
        name: 'guild-leave',
        description: 'Leave a specific guild.',
        type: 1,
        contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
        options: [
            {
                name: 'guild',
                description: 'Select the guild to leave.',
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true,
            },
            {
                name: 'reason',
                description: 'The reason for leaving the guild.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    options: {
        botDevelopers: true,
    },
    run: async (client, interaction) => {
        const guildId = interaction.options.getString('guild');
        const reason = interaction.options.getString('reason');
        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            await interaction.reply({
                content: 'Guild not found.',
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        if (
            guild.id === interaction.guild.id ||
      guild.id === config.development.guildId
        ) {
            await interaction.reply({
                content:
          'You cannot leave this guild as it\'s either your current guild or the development guild.',
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        try {
            await guild.leave();
            const staffAnnouncementChannel = client.channels.cache.get(
                config.development.staffAnnouncementChannel
            );

            if (staffAnnouncementChannel) {
                await staffAnnouncementChannel.send({
                    content: `**${guild.name} (${guild.id}) was forcefully ejected from the Project with the reason: ${reason}!**`,
                });
            }

            await interaction.reply({
                content: `**${guild.name} (${guild.id}) was forcefully ejected from the Project with the reason: ${reason}!**`,
            });
        } catch (error) {
            await interaction.reply({
                content: 'Failed to leave the guild.',
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }
    },
});
