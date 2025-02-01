const { 
  MessageFlags, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const LanguageManager = require("../../utils/LanguageManager");

module.exports = new ApplicationCommand({
  command: {
    name: "help",
    description: "Replies with a list of available application commands.",
    type: 1,
    contexts: [0, 2],
    options: [],
  },
  options: {
    cooldown: 10000,
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    try {
      // Get guild settings for language from MongoDB
      const guildSettings = await client.database_handler.findOne('settings', {
        guild: interaction.guildId
      });
      const lang = guildSettings?.language || 'en';

      // Group commands by category
      const commandsByCategory = new Map();
      
      client.collection.application_commands
        .filter(cmd => 
          cmd.command.name !== "help" && 
          cmd.command.name !== "Ask for Charname" &&
          cmd.command.type === 1 &&
          cmd.category !== 'Developer'
        )
        .forEach(cmd => {
          const category = cmd.category || 'Other';
          
          if (!commandsByCategory.has(category)) {
            commandsByCategory.set(category, []);
          }
          
          commandsByCategory.get(category).push(cmd);
        });

      // Create embeds array
      let embeds = [];
      const categories = Array.from(commandsByCategory.entries());
      
      // Process categories in pairs
      for (let i = 0; i < categories.length; i += 2) {
        const embed = new EmbedBuilder()
          .setColor("#2B2D31")
          .setTitle(LanguageManager.getText('commands.help.EMBED.TITLE', lang))
          .setDescription(LanguageManager.getText('commands.help.EMBED.DESCRIPTION', lang))
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({ 
            text: LanguageManager.getText('commands.help.EMBED.FOOTER', lang, { 
              USER_TAG: interaction.user.tag 
            }),
            iconURL: interaction.user.displayAvatarURL()
          });

        // Add first category
        const [category1, commands1] = categories[i];
        embed.addFields({ 
          name: `__${category1}__`, 
          value: '\u200b',
          inline: false 
        });
        
        commands1.forEach(cmd => {
          embed.addFields({
            name: `/${cmd.command.name}`,
            value: cmd.command.description || LanguageManager.getText('commands.help.NO_DESCRIPTION', lang),
            inline: true
          });
        });

        // Add second category if it exists
        if (i + 1 < categories.length) {
          const [category2, commands2] = categories[i + 1];
          
          // Add spacer between categories
          embed.addFields({ name: '\u200b', value: '\u200b', inline: false });
          
          embed.addFields({ 
            name: `__${category2}__`, 
            value: '\u200b',
            inline: false 
          });
          
          commands2.forEach(cmd => {
            embed.addFields({
              name: `/${cmd.command.name}`,
              value: cmd.command.description || LanguageManager.getText('commands.help.NO_DESCRIPTION', lang),
              inline: true
            });
          });
        }

        embeds.push(embed);
      }

      // If there's only one page, send it without buttons
      if (embeds.length === 1) {
        await interaction.editReply({
          embeds: [embeds[0]]
        });
        return;
      }

      // Create navigation buttons with localized labels
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel(LanguageManager.getText('commands.help.BUTTONS.PREVIOUS', lang))
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel(LanguageManager.getText('commands.help.BUTTONS.NEXT', lang))
          .setStyle(ButtonStyle.Primary)
      );

      // Send initial embed with buttons
      const response = await interaction.editReply({
        embeds: [embeds[0]],
        components: [row]
      });

      let currentPage = 0;

      // Create button collector
      const collector = response.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        try {
          // Update current page based on button pressed
          if (i.customId === "previous") {
            currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
          } else if (i.customId === "next") {
            currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
          }

          // Update embed
          await i.update({
            embeds: [embeds[currentPage]],
            components: [row],
          });
        } catch (error) {
          console.error('Error handling button interaction:', error);
        }
      });

      collector.on("end", async () => {
        try {
          // Remove buttons when collector expires
          await interaction.editReply({
            embeds: [embeds[currentPage]],
            components: []
          });
        } catch (error) {
          console.error('Error removing components:', error);
        }
      });
    } catch (error) {
      console.error('Error in help command:', error);
      await interaction.editReply({
        content: 'An error occurred while fetching the help information.',
        embeds: []
      });
    }
  },
})
