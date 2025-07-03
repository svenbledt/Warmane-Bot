const mongoose = require('mongoose');

const blacklistedWordSchema = new mongoose.Schema({
    guild: { type: String, required: function() { return !this.global; } },
    word: { type: String, required: true },
    addedBy: { type: String, required: true }, // User ID who added the word
    addedByUsername: { type: String, required: true }, // Username for display
    reason: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    deleteMessage: { type: Boolean, default: true }, // Whether to delete messages containing this word
    warnUser: { type: Boolean, default: true }, // Whether to warn the user
    caseSensitive: { type: Boolean, default: false }, // Whether the word check is case sensitive
    useContextAnalysis: { type: Boolean, default: false }, // Whether to use context analysis
    contextThreshold: { type: Number, default: 1.0, min: 0, max: 1 }, // Confidence threshold for context analysis
    global: { type: Boolean, default: false }, // New field for global words
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    strict: true
});

// Compound index to ensure unique words per guild (global words have null guild)
blacklistedWordSchema.index({ guild: 1, word: 1 }, { unique: true, sparse: true });

// Index for efficient word lookups
blacklistedWordSchema.index({ guild: 1, enabled: 1 });

// Update the updatedAt field on save
blacklistedWordSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const BlacklistedWord = mongoose.model('BlacklistedWord', blacklistedWordSchema);

module.exports = BlacklistedWord; 