const { MessageFlags, Message } = require("discord.js");
const MessageCommand = require("../../structure/MessageCommand");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

const application_commands_cooldown = new Map();
const message_commands_cooldown = new Map();

/**
 * @param {import("discord.js").Interaction} interaction
 * @param {ApplicationCommand['data']['options']} options
 * @param {ApplicationCommand['data']['command']} command
 * @returns {Promise<boolean>}
 */
const handleApplicationCommandOptions = async (
  interaction,
  options,
  command
) => {
  try {
    // Check cooldown first
    if (options.cooldown) {
      if (application_commands_cooldown.has(interaction.user.id)) {
        let data = application_commands_cooldown.get(interaction.user.id);

        if (data.some((cmd) => cmd === interaction.commandName)) {
          try {
            await interaction.reply({
              content: config.messages.GUILD_COOLDOWN.replace(
                /%cooldown%/g,
                options.cooldown / 1000
              ),
              flags: [MessageFlags.Ephemeral]
            });
          } catch (error) {
            if (error.code === 10062) {
              // Expected error, do nothing
            } else {
              throw error;
            }
          }
          return false;
        }
      }

      // Set cooldown after passing the check
      let data = application_commands_cooldown.get(interaction.user.id) || [];
      data.push(interaction.commandName);
      application_commands_cooldown.set(interaction.user.id, data);

      setTimeout(() => {
        let data = application_commands_cooldown.get(interaction.user.id);
        if (!data) return;

        data = data.filter((v) => v !== interaction.commandName);

        if (data.length <= 0) {
          application_commands_cooldown.delete(interaction.user.id);
        } else {
          application_commands_cooldown.set(interaction.user.id, data);
        }
      }, options.cooldown);
    }

    // Other checks...
    if (options.botOwner && interaction.user.id !== config.users.ownerId) {
      try {
        await interaction.reply({
          content: config.messages.NOT_BOT_OWNER,
          flags: [MessageFlags.Ephemeral]
        });
      } catch (error) {
        if (error.code !== 10062) throw error;
      }
      return false;
    }

    if (options.botDevelopers && 
        config.users?.developers?.length > 0 && 
        !config.users?.developers?.includes(interaction.user.id)) {
      try {
        await interaction.reply({
          content: config.messages.NOT_BOT_DEVELOPER,
          flags: [MessageFlags.Ephemeral]
        });
      } catch (error) {
        if (error.code !== 10062) throw error;
      }
      return false;
    }

    if (options.guildOwner && interaction.user.id !== interaction.guild.ownerId) {
      try {
        await interaction.reply({
          content: config.messages.NOT_GUILD_OWNER,
          flags: [MessageFlags.Ephemeral]
        });
      } catch (error) {
        if (error.code !== 10062) throw error;
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in handleApplicationCommandOptions:', error);
    return false;
  }
};

/**
 *
 * @param {Message} message
 * @param {MessageCommand['data']['options']} options
 * @param {MessageCommand['data']['command']} command
 * @returns {boolean}
 */
const handleMessageCommandOptions = async (message, options, command) => {
  if (options.botOwner) {
    if (message.author.id !== config.users.ownerId) {
      await message.reply({
        content: config.messages.NOT_BOT_OWNER,
      });

      return false;
    }
  }

  if (options.botDevelopers) {
    if (
      config.users?.developers?.length > 0 &&
      !config.users?.developers?.includes(message.author.id)
    ) {
      await message.reply({
        content: config.messages.NOT_BOT_DEVELOPER,
      });

      return false;
    }
  }

  if (options.guildOwner) {
    if (message.author.id !== message.guild.ownerId) {
      await message.reply({
        content: config.messages.NOT_GUILD_OWNER,
      });

      return false;
    }
  }

  if (options.nsfw) {
    if (!message.channel.nsfw) {
      await message.reply({
        content: config.messages.CHANNEL_NOT_NSFW,
      });

      return false;
    }
  }

  if (options.cooldown) {
    const cooldownFunction = () => {
      let data = message_commands_cooldown.get(message.author.id);

      data.push(command.name);

      message_commands_cooldown.set(message.author.id, data);

      setTimeout(() => {
        let data = message_commands_cooldown.get(message.author.id);

        data = data.filter((cmd) => cmd !== command.name);

        if (data.length <= 0) {
          message_commands_cooldown.delete(message.author.id);
        } else {
          message_commands_cooldown.set(message.author.id, data);
        }
      }, options.cooldown);
    };

    if (message_commands_cooldown.has(message.author.id)) {
      let data = message_commands_cooldown.get(message.author.id);

      if (data.some((v) => v === command.name)) {
        await message.reply({
          content: config.messages.GUILD_COOLDOWN.replace(
            /%cooldown%/g,
            options.cooldown / 1000
          ),
        });

        return false;
      } else {
        cooldownFunction();
      }
    } else {
      message_commands_cooldown.set(message.author.id, [command.name]);
      cooldownFunction();
    }
  }

  return true;
};

module.exports = {
  handleApplicationCommandOptions,
  handleMessageCommandOptions,
};
