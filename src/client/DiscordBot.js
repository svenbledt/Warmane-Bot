const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const { QuickYAML } = require("quick-yaml.db");
const LanguageManager = require('../utils/LanguageManager');

class DiscordBot extends Client {
  collection = {
    application_commands: new Collection(),
    message_commands: new Collection(),
    message_commands_aliases: new Collection(),
    components: {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection(),
      autocomplete: new Collection(),
    },
  };
  rest_application_commands_array = [];
  login_attempts = 0;
  login_timestamp = 0;

  commands_handler = new CommandsHandler(this);
  components_handler = new ComponentsHandler(this);
  events_handler = new EventsHandler(this);
  database = new QuickYAML(config.database.path);

  constructor() {
    super({
      intents: 13827, // Combined bitfield for the necessary intents
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
      ],
      presence: {
        activities: [
          {
            name: "keep this empty",
            type: 4,
            state: "Watching some cool stuff",
          },
        ],
      },
    });

    new CommandsListener(this);
    new ComponentsListener(this);

    LanguageManager.loadLanguage('en');
    LanguageManager.loadLanguage('de');
    LanguageManager.loadLanguage('ru');
    LanguageManager.loadLanguage('fr');
    LanguageManager.loadLanguage('es');
  }

  connect = async () => {
    warn(
      `Attempting to connect to the Discord bot... (${this.login_attempts + 1})`
    );

    this.login_timestamp = Date.now();

    try {
      await this.login(process.env.CLIENT_TOKEN);
      this.commands_handler.load();
      this.components_handler.load();
      this.events_handler.load();
      this.commands = new Collection();
      warn(
        "Attempting to delete application commands... (this might take a while!)"
      );
      await this.commands_handler.deleteApplicationCommands(config.development);
      success("Successfully deleted application commands.");
      warn(
        "Attempting to register application commands... (this might take a while!)"
      );
      await this.commands_handler.registerApplicationCommands(
        config.development
      );
      success(
        "Successfully registered application commands. For specific guild? " +
          (config.development.enabled ? "Yes" : "No")
      );
    } catch (err) {
      error("Failed to connect to the Discord bot, retrying...");
      error(err);
      this.login_attempts++;
      setTimeout(this.connect, 5000);
    }
  };
}

module.exports = DiscordBot;
