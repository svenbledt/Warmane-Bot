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
    }
}, { 
    timestamps: true,
    collection: 'blacklisted',
    versionKey: false
});

// Transform to match YAML structure
BlacklistedUserSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret._id;
        return ret;
    }
});

// Use 'Blacklisted' as the model name but force 'blacklisted' as collection name
module.exports = mongoose.model('Blacklisted', BlacklistedUserSchema, 'blacklisted'); 