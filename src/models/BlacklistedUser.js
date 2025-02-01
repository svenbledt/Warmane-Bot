const mongoose = require('mongoose');

const BlacklistedUserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BlacklistedUser', BlacklistedUserSchema); 