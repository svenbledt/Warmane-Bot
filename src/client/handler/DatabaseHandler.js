const mongoose = require('mongoose');
const { error, success, info, warn } = require("../../utils/Console");
const BlacklistedUser = require('../../models/BlacklistedUser');
const GuildSettings = require('../../models/GuildSettings');
const UserCharacter = require('../../models/UserCharacter');
const LevelingProgress = require('../../models/LevelingProgress');
const AccountStanding = require('../../models/accountStanding');

class DatabaseHandler {
    /**
     * @param {DiscordBot} client
     */
    constructor(client) {
        this.client = client;
        this.models = {
            blacklisted: BlacklistedUser,
            settings: GuildSettings,
            userCharacters: UserCharacter,
            levelingProgress: LevelingProgress,
            accountStanding: AccountStanding
        };
    }

    async connect() {
        try {
            await mongoose.connect(this.client.MONGODB_URI, {
                dbName: this.client.DB_NAME,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            success('Successfully connected to MongoDB via Mongoose');
        } catch (err) {
            error('MongoDB connection error:', err);
            throw err;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            success('Successfully disconnected from MongoDB');
        } catch (err) {
            error('MongoDB disconnection error:', err);
            throw err;
        }
    }

    // Helper methods that match the YAML structure
    async getBlacklisted() {
        try {
            const blacklisted = await this.models.blacklisted.find({});
            return { blacklisted };
        } catch (err) {
            error('Error getting blacklisted users:', err);
            throw err;
        }
    }

    async getSettings() {
        try {
            const settings = await this.models.settings.find({});
            return { settings };
        } catch (err) {
            error('Error getting settings:', err);
            throw err;
        }
    }

    async getUserCharacters() {
        try {
            const users = await this.models.userCharacters.find({});
            const transformed = {};
            users.forEach(user => {
                transformed[user.userId] = {
                    main: user.main,
                    alts: user.alts
                };
            });
            return { userCharacters: transformed };
        } catch (err) {
            error('Error getting user characters:', err);
            throw err;
        }
    }

    // Basic CRUD operations with debugging
    async findOne(modelName, query) {
        try {
            return await this.models[modelName].findOne(query);
        } catch (err) {
            error(`Error in findOne operation for ${modelName}:`, err);
            throw err;
        }
    }

    async find(modelName, query) {
        try {
            return await this.models[modelName].find(query);
        } catch (err) {
            error(`Error in find operation for ${modelName}:`, err);
            throw err;
        }
    }

    // Add findMany as an alias to find
    async findMany(modelName, query) {
        return this.find(modelName, query);
    }

    async create(modelName, data) {
        try {
            return await this.models[modelName].create(data);
        } catch (err) {
            error(`Error in create operation for ${modelName}:`, err);
            throw err;
        }
    }

    async updateOne(modelName, query, update, options = {}) {
        try {
            return await this.models[modelName].updateOne(query, update, options);
        } catch (err) {
            error(`Error in updateOne operation for ${modelName}:`, err);
            throw err;
        }
    }

    async deleteOne(modelName, query) {
        try {
            return await this.models[modelName].deleteOne(query);
        } catch (err) {
            error(`Error in deleteOne operation for ${modelName}:`, err);
            throw err;
        }
    }

    // Helper method for getting or creating guild settings
    async getGuildSettings(guildId, guildName) {
        try {
            return await this.models.settings.getOrCreate(guildId, guildName);
        } catch (err) {
            error('Error getting guild settings:', err);
            throw err;
        }
    }

    // Helper method for getting or creating user character profile
    async getUserCharacter(userId, mainCharacter = null) {
        try {
            return await this.models.userCharacters.getOrCreate(userId, mainCharacter);
        } catch (err) {
            error('Error getting user character:', err);
            throw err;
        }
    }

    // Helper method to check if a user is blacklisted
    async isBlacklisted(userId) {
        try {
            const blacklisted = await this.models.blacklisted.findOne({ id: userId });
            return !!blacklisted;
        } catch (err) {
            error('Error checking blacklist status:', err);
            throw err;
        }
    }

    // Add transaction support
    async withTransaction(callback) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const result = await callback(session);
            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async ensureGuildSettings(guildId, guildName) {
        info(`Ensuring guild settings for ${guildName} (${guildId})`);
        const defaultSettings = {
            guild: guildId,
            guildName: guildName,
            welcomeMessage: false,
            welcomeChannel: "",
            CharNameAsk: false,
            BlockList: true,
            language: "en",
            logChannel: "",
            enableLogging: false,
            levelingSystem: false,
            levelingChannel: "",
            charNameAskDM:
                "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.",
            lastOwnerDM: {},
        };

        const guildSettings = await this.models.settings.findOne({ guild: guildId });
        
        if (!guildSettings) {
            info(`No settings found for ${guildName}, creating new settings`);
            return await this.models.settings.create(defaultSettings);
        }

        info(`Found existing settings for ${guildName}, checking for updates`);
        const missingSettings = {};
        let needsUpdate = false;

        for (const [key, value] of Object.entries(defaultSettings)) {
            if (!guildSettings.hasOwnProperty(key)) {
                info(`Missing setting: ${key} for ${guildName}`);
                missingSettings[key] = value;
                needsUpdate = true;
            }
        }

        if (guildSettings.guildName !== guildName) {
            info(`Updating guild name from ${guildSettings.guildName} to ${guildName}`);
            missingSettings.guildName = guildName;
            needsUpdate = true;
        }

        if (needsUpdate) {
            info(`Updating settings for ${guildName}`);
            return await this.models.settings.findOneAndUpdate(
                { guild: guildId },
                { $set: missingSettings },
                { new: true }
            );
        }

        return guildSettings;
    }

    async updateAllGuildSettings(client) {
        const currentGuildIds = Array.from(client.guilds.cache.keys());

        const settings = await this.models.settings.find({
            guild: { $in: currentGuildIds }
        });

        const existingSettings = new Map(settings.map(setting => [setting.guild, setting]));
        for (const guildId of currentGuildIds) {
            const guild = client.guilds.cache.get(guildId);
            if (!existingSettings.has(guildId)) {
                info(`Creating new settings for ${guild.name} (${guildId})`);
                await this.ensureGuildSettings(guildId, guild.name);
            }
        }
    }
}

module.exports = DatabaseHandler; 