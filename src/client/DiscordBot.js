const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const LanguageManager = require('../utils/LanguageManager');
const DatabaseHandler = require('./handler/DatabaseHandler');

class DiscordBot extends Client {
  collection = {
    application_commands: new Collection(),
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

  mongoClient = null;
  db = null;

  database_handler = null;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildVoiceStates
      ],
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

    // Initialize MongoDB connection URL and DB name
    this.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.DB_NAME = process.env.DB_NAME || 'warmane_bot';
  }

  async connectToMongoDB() {
    try {
      this.database_handler = new DatabaseHandler(this);
      await this.database_handler.connect();
      success('Successfully connected to MongoDB and initialized database.');
    } catch (err) {
      error('MongoDB connection error:', err);
      throw err;
    }
  }

  connect = async () => {
    warn(
      `Attempting to connect to the Discord bot... (${this.login_attempts + 1})`
    );

    this.login_timestamp = Date.now();

    try {
      // Connect to MongoDB first
      await this.connectToMongoDB();
      
      // Login to Discord
      await this.login(process.env.CLIENT_TOKEN);

      // Load handlers
      this.commands_handler.load();
      this.components_handler.load();
      this.events_handler.load();

      // Initialize commands collection
      this.commands = new Collection();

      // Delete and register application commands
      await this.commands_handler.deleteApplicationCommands(config.development);
      await this.commands_handler.registerApplicationCommands(config.development);
    } catch (err) {
      error("Failed to connect to services, retrying...");
      error(err);
      this.login_attempts++;
      setTimeout(this.connect, 5000);
    }
  };

  // Add a cleanup method for proper shutdown
  async disconnect() {
    if (this.database_handler) {
      await this.database_handler.disconnect();
    }
    if (this.isReady()) {
      await this.destroy();
      info('Discord bot connection closed.');
    }
  }
}

module.exports = DiscordBot;
