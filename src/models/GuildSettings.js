const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
    guild: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    welcomeMessage: { type: Boolean, default: false },
    welcomeChannel: { type: String, default: "" },
    CharNameAsk: { type: Boolean, default: false },
    BlockList: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    logChannel: { type: String, default: "" },
    enableLogging: { type: Boolean, default: false },
    charNameAskDM: { 
        type: String, 
        default: "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server."
    },
    lastOwnerDM: { type: Map, of: Number, default: {} },
    levelingSystem: { type: Boolean, default: false }
}, {
    timestamps: true,
    strict: true
});

const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

module.exports = GuildSettings; 