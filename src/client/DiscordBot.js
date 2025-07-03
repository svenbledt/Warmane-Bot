const { Client, Partials, GatewayIntentBits } = require('discord.js');
const CommandsHandler = require('./handler/CommandsHandler');
const { warn, error, info, success } = require('../utils/Console');
const config = require('../config');
const CommandsListener = require('./handler/CommandsListener');
const ComponentsHandler = require('./handler/ComponentsHandler');
const ComponentsListener = require('./handler/ComponentsListener');
const EventsHandler = require('./handler/EventsHandler');
const LanguageManager = require('../utils/LanguageManager');
const DatabaseHandler = require('./handler/DatabaseHandler');
const LevelingSystemHandler = require('./handler/LevelingSystemHandler');

class DiscordBot extends Client {
    // Use private fields for better encapsulation
    #loginAttempts = 0;
    #loginTime = 0;
    #databaseHandler = null;
    #levelingSystemHandler = null;

    // Simplified collection structure using Map for better performance
    collection = {
        application_commands: new Map(),
        components: {
            buttons: new Map(),
            selects: new Map(),
            modals: new Map(),
            autocomplete: new Map(),
        },
    };

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
            partials: Object.values(Partials).filter(partial => 
                ['Channel', 'GuildMember', 'Message', 'Reaction', 'User'].includes(partial)
            ),
            presence: {
                activities: [{
                    name: 'keep this empty',
                    type: 4,
                    state: 'Watching some cool stuff',
                }],
            },
        });

        this.config = config;
        this.initializeHandlers();
        this.loadLanguages();
        this.initializeEnvironmentVariables();
    }

    // Split initialization logic into separate methods
    initializeHandlers() {
        this.commands_handler = new CommandsHandler(this);
        this.components_handler = new ComponentsHandler(this);
        this.events_handler = new EventsHandler(this);
        new CommandsListener(this);
        new ComponentsListener(this);
        this.#levelingSystemHandler = new LevelingSystemHandler(this);
    }

    loadLanguages() {
        ['en', 'de', 'ru', 'fr', 'es'].forEach(lang => 
            LanguageManager.loadLanguage(lang)
        );
    }

    initializeEnvironmentVariables() {
        this.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        this.DB_NAME = process.env.DB_NAME || 'warmane_bot';
    }

    async connectToMongoDB() {
        try {
            this.#databaseHandler = new DatabaseHandler(this);
            await this.#databaseHandler.connect();
            success('Successfully connected to MongoDB and initialized database.');
        } catch (err) {
            error('MongoDB connection error:', err);
            throw err;
        }
    }

    async connect() {
        warn(`Attempting to connect to the Discord bot... (${this.#loginAttempts + 1})`);
        this.#loginTime = Date.now();

        try {
            await this.connectToMongoDB();
            await this.login(process.env.CLIENT_TOKEN);
            await this.initializeBot();
        } catch (err) {
            error('Failed to connect to services, retrying...');
            error(err);
            this.#loginAttempts++;
            setTimeout(() => this.connect(), 5000);
        }
    }

    // Separate initialization logic
    async initializeBot() {
        this.commands_handler.load();
        this.components_handler.load();
        this.events_handler.load();
        this.commands = new Map(); // Using Map instead of Collection

        await this.commands_handler.deleteApplicationCommands(config.development);
        await this.commands_handler.registerApplicationCommands(config.development);
    }

    async disconnect() {
        try {
            if (this.#databaseHandler) {
                await this.#databaseHandler.disconnect();
            }
            if (this.isReady()) {
                await this.destroy();
                info('Discord bot connection closed.');
            }
        } catch (err) {
            error('Error during disconnect:', err);
        }
    }

    // Add getters for private handlers
    getDatabaseHandler() {
        return this.#databaseHandler;
    }

    getLevelingSystemHandler() {
        return this.#levelingSystemHandler;
    }

    getLoginTime() {
        return this.#loginTime;
    }
}

module.exports = DiscordBot;
