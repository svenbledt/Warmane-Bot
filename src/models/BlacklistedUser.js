const mongoose = require('mongoose');

const blacklistedUserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    moderator: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true,
    strict: false
});

// Transform to match YAML structure
blacklistedUserSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret._id;
        return ret;
    }
});

const BlacklistedUser = mongoose.model('BlacklistedUser', blacklistedUserSchema);

module.exports = BlacklistedUser; 