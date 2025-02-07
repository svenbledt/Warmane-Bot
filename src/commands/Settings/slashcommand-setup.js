/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    StringSelectMenuBuilder,
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const config = require('../../config');

const languageNames = {
    'en': 'English',
    'de': 'Deutsch',
    'es': 'Español',
    'fr': 'Français',
    'ru': 'Русский'
};

function createSettingsEmbed(guildSettings, language = 'en') {
    const t = (key) => LanguageManager.getText(`commands.setup.${key}`, language);
    const f = (key) => LanguageManager.getText(`commands.setup.features.${key}`, language);

    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(t('title'))
        .setDescription(t('description'))
        .addFields(
            {
                name: f('welcome_message.name'),
                value: `${f('status.' + (guildSettings.welcomeMessage ? 'enabled' : 'disabled'))}\n` +
               `${f('status.channel').replace('{channel}', guildSettings.welcomeChannel ? `<#${guildSettings.welcomeChannel}>` : t('not_set'))}\n` +
               `${f('welcome_message.description')}`,
                inline: false
            },
            {
                name: f('char_name.name'),
                value: `${f('status.' + (guildSettings.CharNameAsk ? 'enabled' : 'disabled'))}\n` +
               `${f('char_name.description')}`,
                inline: false
            },
            {
                name: f('block_list.name'),
                value: `${f('status.' + (guildSettings.BlockList ? 'enabled' : 'disabled'))}\n` +
               `${f('block_list.description')}`,
                inline: false
            },
            {
                name: f('logging.name'),
                value: `${f('status.' + (guildSettings.enableLogging ? 'enabled' : 'disabled'))}\n` +
               `${f('status.channel').replace('{channel}', guildSettings.logChannel ? `<#${guildSettings.logChannel}>` : t('not_set'))}\n` +
               `${f('logging.description')}`,
                inline: false
            },
            {
                name: f('leveling.name'),
                value: `${f('status.' + (guildSettings.levelingSystem ? 'enabled' : 'disabled'))}\n` +
               `${f('status.channel').replace('{channel}', guildSettings.levelingChannel ? `<#${guildSettings.levelingChannel}>` : t('not_set'))}\n` +
               `${f('leveling.description')}`,
                inline: false
            },
            {
                name: f('language.name'),
                value: `${f('language.current').replace('{language}', languageNames[guildSettings.language])}\n` +

               `${f('language.description')}`,
                inline: false
            },
        )
        .setFooter({ text: t('footer') });
}


function createSettingsButtons(guildSettings) {
    const components = [];
    const t = (key) => LanguageManager.getText(`commands.setup.buttons.${key}`, guildSettings.language || 'en');
  
    // If welcome message is enabled but no channel is set, only show channel select
    if (guildSettings.welcomeMessage && !guildSettings.welcomeChannel) {
        const channelSelect = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('set_welcomeChannel')
                    .setPlaceholder(LanguageManager.getText('commands.setup.select_welcome_channel', guildSettings.language || 'en'))
                    .setChannelTypes(ChannelType.GuildText)
            );
        components.push(channelSelect);
        return components;
    }

    // If logging is enabled but no channel is set, only show channel select
    if (guildSettings.enableLogging && !guildSettings.logChannel) {
        const channelSelect = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('set_logChannel')
                    .setPlaceholder(LanguageManager.getText('commands.setup.select_log_channel', guildSettings.language || 'en'))
                    .setChannelTypes(ChannelType.GuildText)
            );
        components.push(channelSelect);
        return components;
    }

    // If leveling is enabled but no channel is set, only show channel select
    if (guildSettings.levelingSystem && !guildSettings.levelingChannel) {
        const channelSelect = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('set_levelingChannel')
                    .setPlaceholder(LanguageManager.getText('commands.setup.select_leveling_channel', guildSettings.language || 'en'))
                    .setChannelTypes(ChannelType.GuildText)
            );
        components.push(channelSelect);
        return components;
    }

    // Otherwise show all buttons
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('toggle_welcomeMessage')
                .setLabel(t('welcome_message'))
                .setStyle(guildSettings.welcomeMessage ? ButtonStyle.Success : ButtonStyle.Danger)
                .setEmoji('👋'),
            new ButtonBuilder()
                .setCustomId('toggle_CharNameAsk')
                .setLabel(t('char_name_ask'))
                .setStyle(guildSettings.CharNameAsk ? ButtonStyle.Success : ButtonStyle.Danger)
                .setEmoji('👤'),
            new ButtonBuilder()
                .setCustomId('toggle_BlockList')
                .setLabel(t('block_list'))
                .setStyle(guildSettings.BlockList ? ButtonStyle.Success : ButtonStyle.Danger)
                .setEmoji('🚫'),
            new ButtonBuilder()
                .setCustomId('toggle_enableLogging')
                .setLabel(t('logging'))
                .setStyle(guildSettings.enableLogging ? ButtonStyle.Success : ButtonStyle.Danger)
                .setEmoji('📝')
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('toggle_levelingSystem')
                .setLabel(t('leveling'))
                .setStyle(guildSettings.levelingSystem ? ButtonStyle.Success : ButtonStyle.Danger)
                .setEmoji('📊'),
            new ButtonBuilder()
                .setCustomId('change_language')
                .setLabel(t('change_language'))
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🌐'),
            new ButtonBuilder()
                .setCustomId('edit_charname_dm')
                .setLabel(t('edit_charname_dm'))
                .setStyle(ButtonStyle.Primary)
                .setEmoji('✏️')
                .setDisabled(!guildSettings.CharNameAsk) // Disable if character name ask is off
        );
  
    components.push(row1, row2);
    return components;
}

module.exports = new ApplicationCommand({
    command: {
        name: 'setup',
        description: 'Manage server settings',
        type: 1,
        contexts: [0],
    },
    options: {},
    run: async (client, interaction) => {
        const isDeveloper = config.users?.developers?.includes(interaction.user.id);
        const isAdmin = interaction.member?.permissions?.has([PermissionsBitField.Flags.Administrator]);
    
        if (!isDeveloper && !isAdmin) {
            const guildSettings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guildId });
            const lang = guildSettings?.language || 'en';
      
            await interaction.reply({
                content: LanguageManager.getText('commands.setup.no_permission', lang),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        const guildSettings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guildId });
        if (!guildSettings) {
            await interaction.reply({
                content: LanguageManager.getText('commands.setup.error_occurred', 'en', { error: 'Guild settings not found' }),
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }

        // Automatically disable logging if no channel is set
        if (guildSettings.enableLogging && !guildSettings.logChannel) {
            guildSettings.enableLogging = false;
            await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, { $set: { enableLogging: false } });
        }

        const embed = createSettingsEmbed(guildSettings, guildSettings.language);
        const buttons = createSettingsButtons(guildSettings);

        await interaction.reply({
            embeds: [embed],
            components: buttons
        });

        const response = await interaction.fetchReply();

        const collector = response.createMessageComponentCollector({
            time: 300000
        });

        collector.on('collect', async (i) => {
            const isDeveloper = config.users?.developers?.includes(i.user.id);
            const isAdmin = i.member?.permissions?.has([PermissionsBitField.Flags.Administrator]);  
            if (!isAdmin && !isDeveloper) {
                await i.reply({
                    content: LanguageManager.getText('commands.setup.no_permission', guildSettings.language || 'en'),
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }

            // Handle language change button
            if (i.customId === 'change_language') {
                try {
                    // Get fresh settings to ensure we have the current language
                    const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
          
                    const languageSelect = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('set_language')
                                .setPlaceholder(LanguageManager.getText('commands.setup.select_language', guildSettings.language || 'en'))
                                .addOptions([
                                    {
                                        label: 'English',
                                        value: 'en',
                                        emoji: '🇬🇧',
                                        default: settings.language === 'en'
                                    },
                                    {
                                        label: 'Deutsch',
                                        value: 'de',
                                        emoji: '🇩🇪',
                                        default: settings.language === 'de'
                                    },
                                    {
                                        label: 'Español',
                                        value: 'es',
                                        emoji: '🇪🇸',
                                        default: settings.language === 'es'
                                    },
                                    {
                                        label: 'Français',
                                        value: 'fr',
                                        emoji: '🇫🇷',
                                        default: settings.language === 'fr'
                                    },
                                    {
                                        label: 'Русский',
                                        value: 'ru',
                                        emoji: '🇷🇺',
                                        default: settings.language === 'ru'
                                    }
                                ])
                        );

                    await i.update({ components: [languageSelect] });
                } catch (error) {
                    console.error('Failed to show language select:', error);
                    await i.followUp({
                        content: LanguageManager.getText('commands.setup.error_occurred', guildSettings.language || 'en').replace('{error}', error.message),
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                return;
            }

            // Handle language selection
            if (i.customId === 'set_language') {
                // Get fresh settings before updating
                const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
        
                const newLanguage = i.values[0];
                // Only update the language value while preserving all other settings
                settings.language = newLanguage;
                await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);

                await i.reply({
                    content: LanguageManager.getText('commands.setup.language_set', newLanguage, {
                        language: languageNames[newLanguage]
                    }),
                    flags: [MessageFlags.Ephemeral],
                });

                const updatedEmbed = createSettingsEmbed(settings, newLanguage);
                const updatedButtons = createSettingsButtons(settings);
        
                await i.message.edit({
                    embeds: [updatedEmbed],
                    components: updatedButtons
                });
                return;
            }

            // Handle charname DM modal
            if (i.customId === 'edit_charname_dm') {
                try {
                    // Get fresh settings to show current value
                    const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });

                    await i.showModal({
                        custom_id: 'charname-dm-modal',
                        title: LanguageManager.getText('commands.setup.charname_dm_modal.title', guildSettings.language),
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 4,
                                        custom_id: 'charname-dm-message',
                                        label: LanguageManager.getText('commands.setup.charname_dm_modal.message_label', guildSettings.language),
                                        style: 2,
                                        min_length: 10,
                                        max_length: 1000,
                                        placeholder: LanguageManager.getText('commands.setup.charname_dm_modal.message_placeholder', guildSettings.language),
                                        value: settings.charNameAskDM || '',
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    });

                    const modalSubmit = await i.awaitModalSubmit({
                        filter: (interaction) => interaction.customId === 'charname-dm-modal',
                        time: 300000
                    }).catch(() => null);

                    if (modalSubmit) {
                        const message = modalSubmit.fields.getTextInputValue('charname-dm-message')
                            .replace(/\\n/g, '\n');

                        // Update the charNameAskDM value
                        settings.charNameAskDM = message;
            
                        // Save to database
                        await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);

                        await modalSubmit.reply({
                            content: LanguageManager.getText('commands.setup.charname_dm_updated', guildSettings.language),
                            flags: [MessageFlags.Ephemeral],
                        });

                        const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                        const updatedButtons = createSettingsButtons(settings);
            
                        await modalSubmit.message.edit({
                            embeds: [updatedEmbed],
                            components: updatedButtons
                        });
                    }
                } catch (error) {
                    console.error('Failed to handle modal:', error);
                    await i.followUp({
                        content: LanguageManager.getText('commands.setup.error_occurred', guildSettings.language).replace('{error}', error.message),
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                return;
            }

            // For all toggle buttons (welcomeMessage, CharNameAsk, BlockList, enableLogging)
            if (i.customId.startsWith('toggle_')) {
                // Get fresh settings before toggle
                const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
        
                const feature = i.customId.replace('toggle_', '');
        
                // Special handling for logging toggle
                if (feature === 'enableLogging') {
                    if (settings.enableLogging) {
                        // If logging is enabled, disable it and clear the channel
                        settings.enableLogging = false;
                        settings.logChannel = '';
                        await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
            
                        const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                        const updatedButtons = createSettingsButtons(settings);
            
                        await i.update({
                            embeds: [updatedEmbed],
                            components: updatedButtons
                        });
                    } else {
                        // If logging is disabled, show channel selection without enabling logging yet
                        const channelSelect = new ActionRowBuilder()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId('set_logChannel')
                                    .setPlaceholder(LanguageManager.getText('commands.setup.select_log_channel', guildSettings.language || 'en'))
                                    .setChannelTypes(ChannelType.GuildText)
                            );

                        await i.update({ components: [channelSelect] });
                    }
                    return;
                }

                // Special handling for welcomeMessage toggle
                if (feature === 'welcomeMessage') {
                    if (settings.welcomeMessage) {
                        // If welcome message is enabled, disable it and clear the channel
                        settings.welcomeMessage = false;
                        settings.welcomeChannel = '';
                        await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
            
                        const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                        const updatedButtons = createSettingsButtons(settings);
            
                        await i.update({
                            embeds: [updatedEmbed],
                            components: updatedButtons
                        });
                    } else {
                        // If welcome message is disabled, show channel selection without enabling welcome message yet
                        const channelSelect = new ActionRowBuilder()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId('set_welcomeChannel')
                                    .setPlaceholder(LanguageManager.getText('commands.setup.select_welcome_channel', guildSettings.language || 'en'))
                                    .setChannelTypes(ChannelType.GuildText)
                            );

                        await i.update({ components: [channelSelect] });
                    }
                    return;
                }

                // Special handling for levelingSystem toggle
                if (feature === 'levelingSystem') {
                    if (settings.levelingSystem) {
                        // If leveling is enabled, disable it and clear the channel
                        settings.levelingSystem = false;
                        settings.levelingChannel = '';
                        await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
            
                        const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                        const updatedButtons = createSettingsButtons(settings);
            
                        await i.update({
                            embeds: [updatedEmbed],
                            components: updatedButtons
                        });
                    } else {
                        // If leveling is disabled, show channel selection without enabling leveling yet
                        const channelSelect = new ActionRowBuilder()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId('set_levelingChannel')
                                    .setPlaceholder(LanguageManager.getText('commands.setup.select_leveling_channel', guildSettings.language || 'en'))
                                    .setChannelTypes(ChannelType.GuildText)
                            );

                        await i.update({ components: [channelSelect] });
                    }
                    return;
                }

                // Handle other toggles
                settings[feature] = !settings[feature];
                await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
        
                const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                const updatedButtons = createSettingsButtons(settings);
        
                await i.update({
                    embeds: [updatedEmbed],
                    components: updatedButtons
                });
                return;
            }

            if (i.customId === 'set_welcomeChannel') {
                // Get fresh settings before updating
                const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
        
                const channel = i.values[0];
                settings.welcomeChannel = channel;
                settings.welcomeMessage = true;  // Enable welcome message only after channel is set
        
                try {
                    await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
          
                    await i.reply({
                        content: LanguageManager.getText('commands.setup.welcome_channel_set', guildSettings.language, {
                            channel: `<#${channel}>`
                        }),
                        flags: [MessageFlags.Ephemeral],
                    });

                    const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                    const updatedButtons = createSettingsButtons(settings);
          
                    await interaction.editReply({
                        embeds: [updatedEmbed],
                        components: updatedButtons
                    });
                } catch (error) {
                    console.error(`Failed to save settings: ${error.message}`);
                    await i.reply({
                        content: LanguageManager.getText('commands.setup.save_failed', guildSettings.language),
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                return;
            }

            if (i.customId === 'set_logChannel') {
                // Get fresh settings before updating
                const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
        
                // Get the selected channel ID
                const channelId = i.values[0];
        
                // Update only the logging-related settings
                settings.logChannel = channelId;
                settings.enableLogging = true;  // Enable logging only after channel is set
        
                // Save updated settings
                await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);

                await i.reply({
                    content: LanguageManager.getText('commands.setup.log_channel_set', guildSettings.language, {
                        channel: `<#${channelId}>`
                    }),
                    flags: [MessageFlags.Ephemeral],
                });

                const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                const updatedButtons = createSettingsButtons(settings);
        
                await i.message.edit({
                    embeds: [updatedEmbed],
                    components: updatedButtons
                });
                return;
            }

            if (i.customId === 'toggle_enableLogging') {
                if (guildSettings.enableLogging) {
                    // If logging is enabled, disable it and clear the channel
                    guildSettings.enableLogging = false;
                    guildSettings.logChannel = '';
                    await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, guildSettings);
          
                    const updatedEmbed = createSettingsEmbed(guildSettings, guildSettings.language);
                    const updatedButtons = createSettingsButtons(guildSettings);
          
                    await i.update({
                        embeds: [updatedEmbed],
                        components: updatedButtons
                    });
                } else {
                    // If logging is disabled, show channel selection without enabling logging yet
                    const channelSelect = new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('set_logChannel')
                                .setPlaceholder(LanguageManager.getText('commands.setup.select_log_channel', guildSettings.language || 'en'))
                                .setChannelTypes(ChannelType.GuildText)
                        );

                    await i.update({ components: [channelSelect] });
                }
                return;
            }

            if (i.customId === 'set_levelingChannel') {
                // Get fresh settings before updating
                const settings = await client.getDatabaseHandler().findOne('settings', { guild: interaction.guild.id });
        
                const channelId = i.values[0];
                settings.levelingChannel = channelId;
                settings.levelingSystem = true;  // Enable leveling only after channel is set
        
                try {
                    await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, settings);
          
                    await i.reply({
                        content: LanguageManager.getText('commands.setup.leveling_channel_set', guildSettings.language, {
                            channel: `<#${channelId}>`
                        }),
                        flags: [MessageFlags.Ephemeral],
                    });

                    const updatedEmbed = createSettingsEmbed(settings, guildSettings.language);
                    const updatedButtons = createSettingsButtons(settings);
          
                    await i.message.edit({
                        embeds: [updatedEmbed],
                        components: updatedButtons
                    });
                } catch (error) {
                    console.error(`Failed to save settings: ${error.message}`);
                    await i.reply({
                        content: LanguageManager.getText('commands.setup.save_failed', guildSettings.language),
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                return;
            }

            const settingName = i.customId.replace('toggle_', '');
      
            if (settingName === 'enableLogging') {
                guildSettings[settingName] = !guildSettings[settingName];
        
                // Clear log channel when disabling logging
                if (!guildSettings.enableLogging) {
                    guildSettings.logChannel = '';
                }
        
                try {
                    await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, guildSettings);
          
                    const updatedEmbed = createSettingsEmbed(guildSettings, guildSettings.language);
                    const updatedButtons = createSettingsButtons(guildSettings);
          
                    await i.update({
                        embeds: [updatedEmbed],
                        components: updatedButtons
                    });
                } catch (error) {
                    console.error(`Failed to save settings: ${error.message}`);
                    await i.reply({
                        content: LanguageManager.getText('commands.setup.save_failed', guildSettings.language),
                        flags: [MessageFlags.Ephemeral]
                    });
                }
                return;
            }

            // Handle other settings toggles
            guildSettings[settingName] = !guildSettings[settingName];

            try {
                await client.getDatabaseHandler().updateOne('settings', { guild: interaction.guild.id }, guildSettings);
        
                const updatedEmbed = createSettingsEmbed(guildSettings, guildSettings.language);
                const updatedButtons = createSettingsButtons(guildSettings);
        
                await i.update({
                    embeds: [updatedEmbed],
                    components: updatedButtons
                });
            } catch (error) {
                console.error(`Failed to save settings: ${error.message}`);
                await i.reply({
                    content: LanguageManager.getText('commands.setup.save_failed', guildSettings.language),
                    flags: [MessageFlags.Ephemeral],
                });
            }
        });

        collector.on('end', async () => {
            try {
                const message = await interaction.channel.messages.fetch(response.id).catch(() => null);
                if (message) {
                    await response.delete().catch(() => {});
                }
            } catch (error) {
                console.error('Failed to delete settings message:', error);
                try {
                    const disabledButtons = createSettingsButtons(guildSettings);
                    disabledButtons.components.forEach(button => button.setDisabled(true));
          
                    await interaction.editReply({
                        components: [disabledButtons],
                        content: LanguageManager.getText('commands.setup.menu_expired', guildSettings.language),
                        embeds: []
                    }).catch(() => {});
                } catch (err) {
                    console.error('Failed to clean up settings message:', err);
                }
            }
        });
    }
});
