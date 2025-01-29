const {
  MessageFlags,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");

const languageNames = {
  'en': 'English',
  'de': 'Deutsch',
  'es': 'Español',
  'fr': 'Français',
  'ru': 'Русский'
};

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",  // Add default language setting
    logChannel: "", // Add logging channel setting
    enableLogging: false, // Add logging toggle
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
    lastOwnerDM: {},
    // Add any other default settings here
  };

  let updated = false;

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!guildSettings.hasOwnProperty(key)) {
      guildSettings[key] = value;
      updated = true;
    }
  }

  return updated;
}

function createSettingsEmbed(guildSettings, language = 'en') {
  const t = (key) => LanguageManager.getText(`commands.settings.${key}`, language);
  const f = (key) => LanguageManager.getText(`commands.settings.features.${key}`, language);

  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(t('title'))
    .setDescription(t('description'))
    .addFields(
      {
        name: f('welcome_message.name'),
        value: `${f('status.enabled').replace('✅', guildSettings.welcomeMessage ? '✅' : '❌')}\n` +
               `${f('status.channel').replace('{channel}', guildSettings.welcomeChannel ? `<#${guildSettings.welcomeChannel}>` : t('not_set'))}\n` +
               `${f('welcome_message.description')}`,
        inline: false
      },
      {
        name: f('char_name_ask.name'),
        value: `${f('status.enabled').replace('✅', guildSettings.CharNameAsk ? '✅' : '❌')}\n${f('char_name_ask.description')}`,
        inline: false
      },
      {
        name: f('block_list.name'),
        value: `${f('status.enabled').replace('✅', guildSettings.BlockList ? '✅' : '❌')}\n${f('block_list.description')}`,
        inline: false
      },
      {
        name: f('logging.name'),
        value: `${f('status.enabled').replace('✅', guildSettings.enableLogging ? '✅' : '❌')}\n` +
               `${f('status.channel').replace('{channel}', guildSettings.logChannel ? `<#${guildSettings.logChannel}>` : t('not_set'))}\n` +
               `${f('logging.description')}`,
        inline: false
      }
    )
    .setFooter({ text: t('footer') });
}

function createSettingsButtons(guildSettings) {
  const components = [];
  const t = (key) => LanguageManager.getText(`commands.settings.buttons.${key}`, guildSettings.language || 'en');
  
  // If welcome message is enabled but no channel is set, only show channel select
  if (guildSettings.welcomeMessage && !guildSettings.welcomeChannel) {
    const channelSelect = new ActionRowBuilder()
      .addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId('set_welcomeChannel')
          .setPlaceholder(t('select_welcome_channel'))
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
          .setPlaceholder(LanguageManager.getText('commands.settings.select_log_channel', guildSettings.language || 'en'))
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
    name: "settings",
    description: "Manage server settings",
    type: 1,
    contexts: [0],
  },
  options: {},
  run: async (client, interaction) => {
    const isDeveloper = config.users?.developers?.includes(interaction.user.id);
    const isAdmin = interaction.member?.permissions?.has([PermissionsBitField.Flags.Administrator]);
    
    let settings = client.database.get("settings") || [];
    let guildSettings = settings.find(
      (setting) => setting.guild === interaction.guild.id
    );

    const language = guildSettings?.language || 'en';
    const t = (key) => LanguageManager.getText(`commands.settings.${key}`, language);

    if (!isDeveloper && !isAdmin) {
      await interaction.reply({
        content: t('no_permission'),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (!guildSettings) {
      guildSettings = { guild: interaction.guild.id };
      settings.push(guildSettings);
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }

    // Automatically disable logging if no channel is set
    if (guildSettings.enableLogging && !guildSettings.logChannel) {
      guildSettings.enableLogging = false;
      client.database.set("settings", settings);
    }

    const embed = createSettingsEmbed(guildSettings, language);
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
          content: t('no_permission'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      // Handle language change button
      if (i.customId === 'change_language') {
        try {
          const languageSelect = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('set_language')
                .setPlaceholder(t('select_language'))
                .addOptions([
                  {
                    label: 'English',
                    value: 'en',
                    emoji: '🇬🇧',
                    default: guildSettings.language === 'en'
                  },
                  {
                    label: 'Deutsch',
                    value: 'de',
                    emoji: '🇩🇪',
                    default: guildSettings.language === 'de'
                  },
                  {
                    label: 'Español',
                    value: 'es',
                    emoji: '🇪🇸',
                    default: guildSettings.language === 'es'
                  },
                  {
                    label: 'Français',
                    value: 'fr',
                    emoji: '🇫🇷',
                    default: guildSettings.language === 'fr'
                  },
                  {
                    label: 'Русский',
                    value: 'ru',
                    emoji: '🇷🇺',
                    default: guildSettings.language === 'ru'
                  }
                ])
            );

          await i.update({ components: [languageSelect] });
        } catch (error) {
          console.error('Failed to show language select:', error);
          await i.followUp({
            content: t('error_occurred').replace('{error}', error.message),
            flags: [MessageFlags.Ephemeral],
          });
        }
        return;
      }

      // Handle language selection
      if (i.customId === 'set_language') {
        const newLanguage = i.values[0];
        // Only update the language value
        guildSettings.language = newLanguage;
        client.database.set("settings", settings);

        await i.reply({
          content: LanguageManager.getText('commands.settings.language_set', newLanguage, {
            language: languageNames[newLanguage]
          }),
          flags: [MessageFlags.Ephemeral],
        });

        const updatedEmbed = createSettingsEmbed(guildSettings, newLanguage);
        const updatedButtons = createSettingsButtons(guildSettings);
        
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
          let settings = client.database.get("settings") || [];
          let guildSettings = settings.find(
            (setting) => setting.guild === interaction.guild.id
          );

          await i.showModal({
            custom_id: "charname-dm-modal",
            title: LanguageManager.getText('commands.settings.charname_dm_modal.title', language),
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "charname-dm-message",
                    label: LanguageManager.getText('commands.settings.charname_dm_modal.message_label', language),
                    style: 2,
                    min_length: 10,
                    max_length: 1000,
                    placeholder: LanguageManager.getText('commands.settings.charname_dm_modal.message_placeholder', language),
                    value: guildSettings.charNameAskDM || '',
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
            const message = modalSubmit.fields.getTextInputValue("charname-dm-message")
              .replace(/\\n/g, '\n');

            // Update the charNameAskDM value
            guildSettings.charNameAskDM = message;
            
            // Save to database
            client.database.set("settings", settings);

            await modalSubmit.reply({
              content: LanguageManager.getText('commands.settings.charname_dm_updated', language),
              flags: [MessageFlags.Ephemeral],
            });

            const updatedEmbed = createSettingsEmbed(guildSettings, language);
            const updatedButtons = createSettingsButtons(guildSettings);
            
            await modalSubmit.message.edit({
              embeds: [updatedEmbed],
              components: updatedButtons
            });
          }
        } catch (error) {
          console.error('Failed to handle modal:', error);
          await i.followUp({
            content: t('error_occurred').replace('{error}', error.message),
            flags: [MessageFlags.Ephemeral],
          });
        }
        return;
      }

      // For all toggle buttons (welcomeMessage, CharNameAsk, BlockList, enableLogging)
      if (i.customId.startsWith('toggle_')) {
        // Get fresh settings before toggle
        let settings = client.database.get("settings") || [];
        let guildSettings = settings.find(
          (setting) => setting.guild === interaction.guild.id
        );

        const feature = i.customId.replace('toggle_', '');
        guildSettings[feature] = !guildSettings[feature];

        // Special handling for logging toggle
        if (feature === 'enableLogging') {
          if (!guildSettings.enableLogging) {
            guildSettings.logChannel = '';
          }
        }

        // Save settings
        client.database.set("settings", settings);
        
        const updatedEmbed = createSettingsEmbed(guildSettings, language);
        const updatedButtons = createSettingsButtons(guildSettings);
        
        await i.update({
          embeds: [updatedEmbed],
          components: updatedButtons
        });
        return;
      }

      if (i.customId === 'set_welcomeChannel') {
        const channel = i.values[0];
        guildSettings.welcomeChannel = channel;
        
        try {
          client.database.set("settings", settings);
          
          await i.reply({
            content: LanguageManager.getText('commands.settings.welcome_channel_set', language, {
              channel: `<#${channel}>`
            }),
            flags: [MessageFlags.Ephemeral],
          });

          const updatedEmbed = createSettingsEmbed(guildSettings, language);
          const updatedButtons = createSettingsButtons(guildSettings);
          
          await interaction.editReply({
            embeds: [updatedEmbed],
            components: updatedButtons
          });
        } catch (error) {
          console.error(`Failed to save settings: ${error.message}`);
          await i.reply({
            content: t('save_failed'),
            flags: [MessageFlags.Ephemeral],
          });
        }
        return;
      }

      if (i.customId === 'set_logChannel') {
        // Get fresh settings before updating
        let settings = client.database.get("settings") || [];
        let guildSettings = settings.find(
          (setting) => setting.guild === interaction.guild.id
        );
        
        // Get the selected channel ID
        const channelId = i.values[0];
        
        // Update only the logging-related settings
        guildSettings.logChannel = channelId;
        guildSettings.enableLogging = true;  // Enable logging only after channel is set
        
        // Save updated settings
        client.database.set("settings", settings);

        await i.reply({
          content: LanguageManager.getText('commands.settings.log_channel_set', language, {
            channel: `<#${channelId}>`
          }),
          flags: [MessageFlags.Ephemeral],
        });

        const updatedEmbed = createSettingsEmbed(guildSettings, language);
        const updatedButtons = createSettingsButtons(guildSettings);
        
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
          client.database.set("settings", settings);
          
          const updatedEmbed = createSettingsEmbed(guildSettings, language);
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
                .setPlaceholder(t('select_log_channel'))
                .setChannelTypes(ChannelType.GuildText)
            );

          await i.update({ components: [channelSelect] });
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
          client.database.set("settings", settings);
          
          const updatedEmbed = createSettingsEmbed(guildSettings, language);
          const updatedButtons = createSettingsButtons(guildSettings);
          
          await i.update({
            embeds: [updatedEmbed],
            components: updatedButtons
          });
        } catch (error) {
          console.error(`Failed to save settings: ${error.message}`);
          await i.reply({
            content: t('save_failed'),
            ephemeral: true
          });
        }
        return;
      }

      // Handle other settings toggles
      guildSettings[settingName] = !guildSettings[settingName];

      try {
        client.database.set("settings", settings);
        
        const updatedEmbed = createSettingsEmbed(guildSettings, language);
        const updatedButtons = createSettingsButtons(guildSettings);
        
        await i.update({
          embeds: [updatedEmbed],
          components: updatedButtons
        });
      } catch (error) {
        console.error(`Failed to save settings: ${error.message}`);
        await i.reply({
          content: t('save_failed'),
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
        try {
          const disabledButtons = createSettingsButtons(guildSettings);
          disabledButtons.components.forEach(button => button.setDisabled(true));
          
          await interaction.editReply({
            components: [disabledButtons],
            content: t('menu_expired'),
            embeds: []
          }).catch(() => {});
        } catch (err) {
          console.error('Failed to clean up settings message:', err);
        }
      }
    });
  }
}).toJSON();
