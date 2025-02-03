const mongoose = require('mongoose');

const accountStandingSchema = new mongoose.Schema({
    user: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    voiceTime: { type: Number, default: 0 }
}, {
    timestamps: true,
    strict: true
});

const AccountStanding = mongoose.model('AccountStanding', accountStandingSchema);

// Sync indexes on model initialization
AccountStanding.syncIndexes();

module.exports = AccountStanding;
