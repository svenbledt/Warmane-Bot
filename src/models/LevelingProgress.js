const mongoose = require('mongoose');

const levelingProgressSchema = new mongoose.Schema({
    guild: { type: String, required: true },
    user: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    voiceTime: { type: Number, default: 0 }
}, {
    timestamps: true,
    strict: true
});

// Create compound unique index for guild+user combination
levelingProgressSchema.index({ guild: 1, user: 1 }, { unique: true });

// Add index for querying levels within a guild (for leaderboards)
levelingProgressSchema.index({ guild: 1, level: -1, xp: -1 });

const LevelingProgress = mongoose.model('LevelingProgress', levelingProgressSchema);

// Sync indexes on model initialization
LevelingProgress.syncIndexes();

module.exports = LevelingProgress;
