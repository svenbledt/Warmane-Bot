const { REST, Routes } = require("discord.js");
const { info, error, success, warn } = require("../../utils/Console");
const { readdirSync } = require("fs");
const DiscordBot = require("../DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

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

          if (commandData.__type__ === 1) {
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
      `Successfully loaded ${this.client.collection.application_commands.size} application commands.`
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
        warn("Attempting to delete all application commands in development mode...");
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
        warn("Fetching existing commands in production mode...");
        const existingCommands = await rest.get(
          Routes.applicationCommands(this.client.user.id)
        );

        const commandsToKeep = this.client.rest_application_commands_array.map(cmd => cmd.name);
        const commandsToDelete = existingCommands.filter(cmd => !commandsToKeep.includes(cmd.name));

        if (commandsToDelete.length > 0) {
          warn(`Deleting ${commandsToDelete.length} outdated commands...`);
          for (const cmd of commandsToDelete) {
            await rest.delete(
              Routes.applicationCommand(this.client.user.id, cmd.id)
            );
            info(`Deleted command: ${cmd.name}`);
          }
          success(`Successfully deleted ${commandsToDelete.length} outdated commands`);
        } else {
          success("No commands need to be deleted");
        }
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
        // In development mode, register all commands to guild
        await rest.put(
          Routes.applicationGuildCommands(
            this.client.user.id,
            development.guildId
          ),
          { body: this.client.rest_application_commands_array }
        );
        success("Successfully registered application commands for development guild");
      } else {
        // In production mode, register commands globally
        await rest.put(
          Routes.applicationCommands(this.client.user.id),
          { body: this.client.rest_application_commands_array }
        );
        success("Successfully registered application commands for all guilds");
      }
      success(`Successfully registered ${this.client.rest_application_commands_array.length} application commands`);
    } catch (err) {
      error("Failed to register application commands:");
      error(err);
    }
  };
}

module.exports = CommandsHandler;
