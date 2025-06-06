const mongoose = require('mongoose');

const blacklistedWordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    points: { type: Number, required: true, default: -1 },
    addedBy: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    strict: true
});

// Create index for faster word lookups
blacklistedWordSchema.index({ word: 1 }, { unique: true });

const BlacklistedWord = mongoose.model('BlacklistedWord', blacklistedWordSchema);

// Sync indexes on model initialization
BlacklistedWord.syncIndexes();

module.exports = BlacklistedWord; 