const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class DevLogger {
  static async log(client, guildId, options) {
    try {
      // Get the development server's log channel
      const devGuild = client.guilds.cache.get(config.development.guildId);
      if (!devGuild) return;

      const devLogChannel = client.channels.cache.get(config.development.logChannel);
      if (!devLogChannel) return;

      // Get the guild where the action occurred
      const actionGuild = client.guilds.cache.get(guildId);
      if (!actionGuild) return;

      const embed = new EmbedBuilder()
        .setColor(options.color || '#0099ff')
        .setTitle(`${options.title || 'Log Event'} | ${actionGuild.name}`)
        .setDescription(options.description)
        .setTimestamp();

      // Add server information field
      embed.addFields({
        name: 'Server Information',
        value: `Name: ${actionGuild.name}\nID: ${actionGuild.id}\nMembers: ${actionGuild.memberCount}`,
        inline: false
      });

      // Add additional fields if they exist
      if (options.fields && Array.isArray(options.fields)) {
        const formattedFields = options.fields.map(field => ({
          name: field.nameKey || field.name || 'Information',
          value: field.value || 'No value provided',
          inline: field.inline || false
        }));
        embed.addFields(formattedFields);
      }

      embed.setFooter({ 
        text: `Development Logs | ${actionGuild.name}`, 
        iconURL: client.user.displayAvatarURL() 
      });

      await devLogChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Development logging failed:', error);
    }
  }
}

module.exports = DevLogger; 