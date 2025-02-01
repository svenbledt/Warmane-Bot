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

    // Helper methods for common operations
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
}

module.exports = DatabaseHandler; 