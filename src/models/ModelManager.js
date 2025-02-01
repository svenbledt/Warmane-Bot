const BlacklistedUserSchema = require('./BlacklistedUser');
const GuildSettingsSchema = require('./GuildSettings');
const UserCharacterSchema = require('./UserCharacter');

class ModelManager {
    constructor(client) {
        this.client = client;
        this.models = {};
    }

    async initialize() {
        try {
            // Initialize collections with schemas
            await this.createCollection('blacklisted', BlacklistedUserSchema);
            await this.createCollection('settings', GuildSettingsSchema);
            await this.createCollection('userCharacters', UserCharacterSchema);

            // Create indexes
            await this.createIndexes();
        } catch (error) {
            console.error('Error initializing models:', error);
            throw error;
        }
    }

    async createCollection(name, schema) {
        const db = this.client.db;
        
        // Check if collection exists
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === name);

        if (!collectionExists) {
            await db.createCollection(name, {
                validator: {
                    $jsonSchema: this.convertSchemaToJsonSchema(schema)
                },
                validationLevel: "moderate"
            });
        } else {
            // Update validation schema for existing collection
            await db.command({
                collMod: name,
                validator: {
                    $jsonSchema: this.convertSchemaToJsonSchema(schema)
                },
                validationLevel: "moderate"
            });
        }

        this.models[name] = db.collection(name);
    }

    async createIndexes() {
        // Create necessary indexes
        await this.models.blacklisted.createIndex({ id: 1 }, { unique: true });
        await this.models.settings.createIndex({ guild: 1 }, { unique: true });
        await this.models.userCharacters.createIndex({ userId: 1 }, { unique: true });
    }

    convertSchemaToJsonSchema(schema) {
        // Convert Mongoose-style schema to MongoDB JSON Schema
        const jsonSchema = {
            bsonType: "object",
            required: [],
            properties: {}
        };

        for (const [key, value] of Object.entries(schema.obj)) {
            const property = {
                bsonType: this.getBsonType(value.type)
            };

            if (value.required) {
                jsonSchema.required.push(key);
            }

            if (value.enum) {
                property.enum = value.enum;
            }

            jsonSchema.properties[key] = property;
        }

        return jsonSchema;
    }

    getBsonType(type) {
        switch (type) {
            case String:
                return "string";
            case Number:
                return "number";
            case Boolean:
                return "bool";
            case Date:
                return "date";
            case Array:
                return "array";
            case Object:
                return "object";
            default:
                return "string";
        }
    }
}

module.exports = ModelManager; 