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
  StringSelectMenuOptionBuilder
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");

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
          .setPlaceholder(t('select_log_channel'))
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
        .setEmoji('🌐')
    );
  
  components.push(row1, row2);
  return components;
}

function createLanguageSelect(language = 'en') {
  const t = (key) => LanguageManager.getText(`commands.settings.buttons.${key}`, language);
  
  const languageSelect = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('set_language')
        .setPlaceholder(t('select_language'))
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('English')
            .setValue('en')
            .setEmoji('🇬🇧'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Deutsch')
            .setValue('de')
            .setEmoji('🇩🇪'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Русский')
            .setValue('ru')
            .setEmoji('🇷🇺'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Français')
            .setValue('fr')
            .setEmoji('🇫🇷'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Español')
            .setValue('es')
            .setEmoji('🇪🇸')
        ])
    );
  return [languageSelect];
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

      if (!isDeveloper && !isAdmin) {
        await i.reply({
          content: t('no_button_permission'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: t('different_user'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      if (i.customId === 'set_logChannel') {
        const channel = i.values[0];
        guildSettings.logChannel = channel;
        
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
        return;
      }

      if (i.customId === 'change_language') {
        const languageSelect = createLanguageSelect(language);
        await i.update({ components: languageSelect });
        return;
      }

      if (i.customId === 'set_language') {
        const newLanguage = i.values[0];
        guildSettings.language = newLanguage;
        
        try {
          client.database.set("settings", settings);
          
          const languageNames = {
            en: "English",
            de: "Deutsch",
            ru: "Русский",
            fr: "Français",
            es: "Español",
          };

          await i.reply({
            content: LanguageManager.getText('commands.settings.language_set', newLanguage, {
              language: languageNames[newLanguage]
            }),
            flags: [MessageFlags.Ephemeral],
          });

          const updatedEmbed = createSettingsEmbed(guildSettings, newLanguage);
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

      if (i.customId === 'toggle_welcomeMessage') {
        guildSettings.welcomeMessage = !guildSettings.welcomeMessage;
        
        // Clear welcome channel when disabling welcome message
        if (!guildSettings.welcomeMessage) {
          guildSettings.welcomeChannel = '';
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
            flags: [MessageFlags.Ephemeral],
          });
        }
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
  },
}).toJSON();
