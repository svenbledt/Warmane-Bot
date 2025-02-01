const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    realm: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const UserCharacterSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    main: {
        type: CharacterSchema,
        required: true
    },
    alts: {
        type: [CharacterSchema],
        default: []
    }
});

module.exports = mongoose.model('UserCharacter', UserCharacterSchema); 