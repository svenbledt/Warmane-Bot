const mongoose = require('mongoose');
const { error, success } = require("../../utils/Console");
const BlacklistedUser = require('../../models/BlacklistedUser');
const GuildSettings = require('../../models/GuildSettings');
const UserCharacter = require('../../models/UserCharacter');

class DatabaseHandler {
    /**
     * @param {DiscordBot} client
     */
    constructor(client) {
        this.client = client;
        this.models = {
            blacklisted: BlacklistedUser,
            settings: GuildSettings,
            userCharacters: UserCharacter
        };
    }

    async connect() {
        try {
            await mongoose.connect(this.client.MONGODB_URI, {
                dbName: this.client.DB_NAME
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

    // Basic CRUD operations
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
}

module.exports = DatabaseHandler; 