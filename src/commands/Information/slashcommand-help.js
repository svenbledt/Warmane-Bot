/*eslint no-unused-vars: "warn"*/
const { 
    MessageFlags, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandOptionType
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');

module.exports = new ApplicationCommand({
    command: {
        name: 'help',
        description: 'Shows all commands',
        type: 1,
        options: [
            {
                name: 'command',
                description: 'Get information about a specific command',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    options: {
        cooldown: 10000,
    },
    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';

        const applicationCommands = config.development.enabled ?
            await interaction.guild.commands.fetch() :
            await client.application.commands.fetch();

        const command = interaction.options.getString('command');

        const categories = {
            Information: [],
            Utility: [],
            Moderation: [],
            Settings: [],
        };

        Array.from(client.collection.application_commands.values()).forEach(cmd => {
            if (cmd.options?.botDevelopers || cmd.command.type !== 1) {
                return;
            }

            let category = 'Utility';
            const filePath = cmd.filePath;
            if (filePath) {
                const match = filePath.match(/commands\/([^/]+)\//);
                if (match && match[1]) {
                    category = match[1];
                }
            }

            categories[category]?.push(cmd);
        });

        const categoryEmojis = {
            Information: '📚',
            Utility: '🛠️',
            Moderation: '🛡️',
            Settings: '⚙️'
        };

        if (command) {
            const cmd = Array.from(client.collection.application_commands.values())
                .find(cmd => cmd.command.name.toLowerCase() === command.toLowerCase());

            if (!cmd) {
                return interaction.reply({
                    content: LanguageManager.getText('commands.help.command_not_found', lang),
                    flags: [MessageFlags.Ephemeral],
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`🔍 Command: /${cmd.command.name}`)
                .setDescription(cmd.command.description)
                .setColor('#0099ff')
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            if (cmd.command.options?.length > 0) {
                embed.addFields({
                    name: LanguageManager.getText('commands.help.options', lang),
                    value: cmd.command.options.map(option => 
                        `> • \`${option.name}\`\n> └ *${option.description || LanguageManager.getText('commands.help.NO_DESCRIPTION', lang)}*`
                    ).join('\n')
                });
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel(LanguageManager.getText('commands.help.BUTTONS.BACK_TO_OVERVIEW', lang))
                    .setStyle(ButtonStyle.Secondary)
            );

            return interaction.reply({
                embeds: [embed],
                components: [row],
                flags: [MessageFlags.Ephemeral],
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 ${LanguageManager.getText('commands.help.EMBED.TITLE', lang)}`)
            .setColor('#0099ff')
            .setDescription(`> ${LanguageManager.getText('commands.help.EMBED.DESCRIPTION', lang)}\n\u200b`)
            .setFooter({ 
                text: LanguageManager.getText('commands.help.EMBED.FOOTER', lang, { USER_TAG: interaction.user.tag }),
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        Object.entries(categories).forEach(([category, commands]) => {
            if (commands && commands.length > 0) {
                embed.addFields({
                    name: `${categoryEmojis[category]} ${category}`,
                    value: commands.map(cmd => {
                        const commandId = applicationCommands.find(c => c.name === cmd.command.name)?.id;
                        let cmdStr;
                        
                        if (cmd.command.options?.some(opt => opt.type === ApplicationCommandOptionType.Subcommand)) {
                            const subcommands = cmd.command.options
                                .filter(opt => opt.type === ApplicationCommandOptionType.Subcommand)
                                .map(sub => {
                                    return commandId ? 
                                        `> • </${cmd.command.name} ${sub.name}:${commandId}>\n> └ *${sub.description}*` :
                                        `> • /${cmd.command.name} ${sub.name}\n> └ *${sub.description}*`;
                                })
                                .join('\n\n');
                            return `\n📎 **${cmd.command.name}** - *${cmd.command.description}*\n${subcommands}\n`;
                        } else {
                            cmdStr = commandId ? 
                                `> • </${cmd.command.name}:${commandId}>` : 
                                `> • /${cmd.command.name}`;
                            return `${cmdStr}\n> └ *${cmd.command.description}*`;
                        }
                    }).join('\n\n')
                    + '\n\u200b'
                });
            }
        });

        return interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral],
        });
    },
});
