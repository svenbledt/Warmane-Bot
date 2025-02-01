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
}, { 
    timestamps: false,  // Disable automatic timestamps
    _id: false         // Disable automatic _id field
});

// This ensures the output matches the old YAML structure
BlacklistedUserSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('BlacklistedUser', BlacklistedUserSchema); 