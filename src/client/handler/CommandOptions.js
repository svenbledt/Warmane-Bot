const { error } = require("../../utils/Console");
const { PermissionsBitField, MessageFlags } = require("discord.js");
const config = require("../../config");

async function handleApplicationCommandOptions(interaction, options, command) {
  try {
    // Owner only check
    if (options.botOwner && interaction.user.id !== config.users.ownerId) {
      await interaction.reply({
        content: config.messages.NOT_BOT_OWNER,
        flags: [MessageFlags.Ephemeral]
      });
      return false;
    }

    // Bot developers check
    if (options.botDevelopers && !config.users.developers.includes(interaction.user.id)) {
      await interaction.reply({
        content: config.messages.NOT_BOT_DEVELOPER,
        flags: [MessageFlags.Ephemeral]
      });
      return false;
    }

    // Guild owner check
    if (options.guildOwner && interaction.guild && interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: config.messages.NOT_GUILD_OWNER,
        flags: [MessageFlags.Ephemeral]
      });
      return false;
    }

    // User permissions check
    if (options.userPermissions) {
      const missingPermissions = [];

      if (typeof options.userPermissions === "bigint") {
        if (!interaction.memberPermissions?.has(options.userPermissions)) {
          missingPermissions.push(
            new PermissionsBitField(options.userPermissions).toArray()
          );
        }
      } else {
        options.userPermissions.forEach((permission) => {
          if (!interaction.memberPermissions?.has(permission)) {
            missingPermissions.push(permission);
          }
        });
      }

      if (missingPermissions.length > 0) {
        await interaction.reply({
          content: config.messages.MISSING_PERMISSIONS,
          flags: [MessageFlags.Ephemeral]
        });
        return false;
      }
    }

    // Client/Bot permissions check
    if (options.clientPermissions) {
      const missingPermissions = [];

      if (typeof options.clientPermissions === "bigint") {
        if (
          !interaction.guild.members.me.permissions.has(options.clientPermissions)
        ) {
          missingPermissions.push(
            new PermissionsBitField(options.clientPermissions).toArray()
          );
        }
      } else {
        options.clientPermissions.forEach((permission) => {
          if (!interaction.guild.members.me.permissions.has(permission)) {
            missingPermissions.push(permission);
          }
        });
      }

      if (missingPermissions.length > 0) {
        await interaction.reply({
          content: config.messages.MISSING_PERMISSIONS,
          flags: [MessageFlags.Ephemeral]
        });
        return false;
      }
    }

    return true;
  } catch (err) {
    error(err);
    return false;
  }
}

module.exports = {
  handleApplicationCommandOptions,
};
