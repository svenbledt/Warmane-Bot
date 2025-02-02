const mongoose = require('mongoose');

const levelingProgressSchema = new mongoose.Schema({
    guild: { type: String, required: true, unique: true },
    user: { type: String, required: true, unique: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    voiceTime: { type: Number, default: 0 }
}, {
    timestamps: true,
    strict: false  // Allow additional fields
});

const LevelingProgress = mongoose.model('LevelingProgress', levelingProgressSchema);

module.exports = LevelingProgress;
