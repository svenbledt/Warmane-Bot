const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guild: {
        type: String,
        required: true,
        unique: true
    },
    welcomeMessage: {
        type: Boolean,
        default: false
    },
    welcomeChannel: String,
    CharNameAsk: {
        type: Boolean,
        default: false
    },
    BlockList: {
        type: Boolean,
        default: false
    },
    guildName: String,
    charNameAskDM: String,
    lastOwnerDM: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    language: {
        type: String,
        default: 'en'
    },
    logChannel: String,
    enableLogging: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: false,
    collection: 'settings',
    versionKey: false
});

GuildSettingsSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret._id;
        return ret;
    }
});

// Static method to get or create guild settings
GuildSettingsSchema.statics.getOrCreate = async function(guildId, guildName) {
    let settings = await this.findOne({ guild: guildId });
    if (!settings) {
        settings = await this.create({
            guild: guildId,
            guildName: guildName
        });
    }
    return settings;
};

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema, 'settings'); 