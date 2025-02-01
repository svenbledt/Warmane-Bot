const { REST, Routes } = require("discord.js");
const { info, error, success, warn } = require("../../utils/Console");
const { readdirSync } = require("fs");
const DiscordBot = require("../DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const MessageCommand = require("../../structure/MessageCommand");

class CommandsHandler {
  client;

  /**
   * @param {DiscordBot} client
   */
  constructor(client) {
    this.client = client;
  }

  load = () => {
    // Clear existing commands before loading
    this.client.collection.message_commands.clear();
    this.client.collection.message_commands_aliases.clear();
    this.client.collection.application_commands.clear();
    this.client.rest_application_commands_array = [];

    for (const directory of readdirSync("./src/commands/")) {
      for (const file of readdirSync("./src/commands/" + directory).filter(
        (f) => f.endsWith(".js")
      )) {
        try {
          delete require.cache[require.resolve(`../../commands/${directory}/${file}`)];
          const filePath = `../../commands/${directory}/${file}`;
          
          const module = require(filePath);

          if (!module) {
            error(`No module exported from ${file}`);
            continue;
          }

          // Parse the module data
          const commandData = module.toJSON ? module.toJSON() : module;

          if (commandData.__type__ === 2) {
            if (!commandData.command || !commandData.run) {
              error("Unable to load the message command " + file);
              continue;
            }

            commandData.category = directory;
            commandData.filePath = filePath;

            this.client.collection.message_commands.set(
              commandData.command.name,
              commandData
            );

            if (
              commandData.command.aliases &&
              Array.isArray(commandData.command.aliases)
            ) {
              commandData.command.aliases.forEach((alias) => {
                this.client.collection.message_commands_aliases.set(
                  alias,
                  commandData.command.name
                );
              });
            }

            info("Loaded new message command: " + file);
          } else if (commandData.__type__ === 1) {
            if (!commandData.command || !commandData.run) {
              error("Unable to load the application command " + file);
              continue;
            }

            commandData.category = directory;
            commandData.filePath = filePath;

            // Store the command in the collection
            this.client.collection.application_commands.set(
              commandData.command.name,
              commandData
            );

            // Add the command data to the registration array
            const registrationData = { ...commandData.command };
            delete registrationData.contexts; // Remove contexts as it's not needed for registration
            this.client.rest_application_commands_array.push(registrationData);

            info("Loaded new application command: " + file);
          } else {
            error(
              "Invalid command type " +
                commandData.__type__ +
                " from command file " +
                file
            );
          }
        } catch (loadError) {
          error(
            "Unable to load a command from the path: " +
              "src/commands/" +
              directory +
              "/" +
              file +
              "\n" +
              loadError
          );
        }
      }
    }

    success(
      `Successfully loaded ${this.client.collection.application_commands.size} application commands and ${this.client.collection.message_commands.size} message commands.`
    );
  };

  reload = async () => {
    try {
      this.load();
      await this.registerApplicationCommands(this.client.config.development);
      success("Successfully reloaded all commands");
    } catch (error) {
      error("Failed to reload commands: " + error);
    }
  };

  deleteApplicationCommands = async (development, restOptions = null) => {
    try {
      const rest = new REST(
        restOptions ? restOptions : { version: "10" }
      ).setToken(this.client.token);

      if (development.enabled) {
        warn("Attempting to delete application commands... (this might take a while!)");
        await rest.put(
          Routes.applicationGuildCommands(
            this.client.user.id,
            development.guildId
          ),
          { body: [] }
        );
        await rest.put(
          Routes.applicationCommands(this.client.user.id),
          { body: [] }
        );
        success("Successfully deleted all application commands");
      } else {
        success("Not in development mode, skipping deletion");
      }
    } catch (error) {
      error("Failed to delete application commands: " + error);
    }
  };

  /**
   * @param {{ enabled: boolean, guildId: string }} development
   * @param {Partial<import('discord.js').RESTOptions>} restOptions
   */
  registerApplicationCommands = async (development, restOptions = null) => {
    try {
      if (!this.client.rest_application_commands_array.length) {
        warn("No commands to register!");
        return;
      }
      warn("Attempting to register application commands... (this might take a while!)");
      const rest = new REST(
        restOptions ? restOptions : { version: "10" }
      ).setToken(this.client.token);

      if (development.enabled) {
        await rest.put(
          Routes.applicationGuildCommands(
            this.client.user.id,
            development.guildId
          ),
          { body: this.client.rest_application_commands_array }
        );
        success(
          "Successfully registered application commands for development guild"
        );
      } else {
        await rest.put(
          Routes.applicationCommands(this.client.user.id),
          { body: this.client.rest_application_commands_array }
        );
        success(
          "Successfully registered application commands for all guilds"
        );
      }
      success(`Successfully registered ${this.client.rest_application_commands_array.length} application commands`);
    } catch (err) {
      error("Failed to register application commands:");
      error(err);
    }
  };
}

module.exports = CommandsHandler;
