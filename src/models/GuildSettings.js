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
    guildName: {
        type: String,
        required: true
    },
    charNameAskDM: String,
    lastOwnerDM: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    language: {
        type: String,
        enum: ['en', 'de', 'ru', 'fr', 'es'],
        default: 'en'
    },
    logChannel: String,
    enableLogging: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema); 