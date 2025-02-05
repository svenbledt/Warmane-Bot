require('dotenv').config();
const { QuickYAML } = require('quick-yaml.db');
const mongoose = require('mongoose');
const { success, error, info, warn } = require('../utils/Console');

// Import models
const BlacklistedUser = require('../models/BlacklistedUser');
const GuildSettings = require('../models/GuildSettings');
const UserCharacter = require('../models/UserCharacter');

async function clearDatabase() {
    try {
        warn('Clearing existing MongoDB collections...');
        
        await Promise.all([
            BlacklistedUser.deleteMany({}),
            GuildSettings.deleteMany({}),
            UserCharacter.deleteMany({})
        ]);
        
        success('Successfully cleared all collections');
    } catch (err) {
        error('Failed to clear database:', err);
        throw err;
    }
}

async function migrateData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME
        });
        info('Connected to MongoDB');

        // Clear existing data first
        await clearDatabase();

        // Load YAML data
        const yamlDB = new QuickYAML('./database.yml');
        
        // Get data from YAML
        const blacklisted = yamlDB.get('blacklisted') || [];
        const settings = yamlDB.get('settings') || [];
        const userCharacters = yamlDB.get('userCharacters') || {};
        
        // Migrate blacklisted users
        if (blacklisted.length > 0) {
            info('Migrating blacklisted users...');
            await BlacklistedUser.insertMany(blacklisted);
            success(`Migrated ${blacklisted.length} blacklisted users`);
        }

        // Migrate guild settings
        if (settings.length > 0) {
            info('Migrating guild settings...');
            await GuildSettings.insertMany(settings);
            success(`Migrated ${settings.length} guild settings`);
        }

        // Migrate user characters
        if (Object.keys(userCharacters).length > 0) {
            info('Migrating user characters...');
            
            const userCharacterArray = Object.entries(userCharacters).map(([userId, data]) => ({
                userId,
                main: data.main,
                alts: data.alts || []
            }));
            
            await UserCharacter.insertMany(userCharacterArray);
            success(`Migrated ${userCharacterArray.length} user characters`);
        }

        success('Migration completed successfully!');
    } catch (err) {
        error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
        info('Disconnected from MongoDB');
    }
}

migrateData(); 