const mongoose = require('mongoose');

const blacklistedWordSchema = new mongoose.Schema({
    guild: { type: String, required: true },
    word: { type: String, required: true },
    addedBy: { type: String, required: true }, // User ID who added the word
    addedByUsername: { type: String, required: true }, // Username for display
    reason: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    deleteMessage: { type: Boolean, default: true }, // Whether to delete messages containing this word
    warnUser: { type: Boolean, default: true }, // Whether to warn the user
    caseSensitive: { type: Boolean, default: false }, // Whether the word check is case sensitive
    useContextAnalysis: { type: Boolean, default: true }, // Whether to use context analysis
    contextThreshold: { type: Number, default: 0.2, min: 0, max: 1 }, // Confidence threshold for context analysis
    global: { type: Boolean, default: false }, // New field for global words
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    strict: true
});

// Compound index to ensure unique words per guild
blacklistedWordSchema.index({ guild: 1, word: 1 }, { unique: true });

// Index for efficient word lookups
blacklistedWordSchema.index({ guild: 1, enabled: 1 });

// Update the updatedAt field on save
blacklistedWordSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const BlacklistedWord = mongoose.model('BlacklistedWord', blacklistedWordSchema);

module.exports = BlacklistedWord; 