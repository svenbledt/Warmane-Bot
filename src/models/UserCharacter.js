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
        type: String,  // Keep as string to match YAML format
        default: () => new Date().toISOString()
    }
}, {
    _id: false,
    versionKey: false
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
}, { 
    timestamps: false,
    collection: 'userCharacters',
    versionKey: false
});

// Transform to match YAML structure
UserCharacterSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret._id;
        // Convert userId to be the top-level key
        const transformed = {
            [ret.userId]: {
                main: ret.main,
                alts: ret.alts
            }
        };
        return transformed;
    }
});

// Method to add an alt character
UserCharacterSchema.methods.addAlt = async function(characterData) {
    if (this.alts.length >= 10) {
        throw new Error('Maximum number of alts reached (10)');
    }
    
    // Check if character already exists
    const exists = this.alts.some(alt => 
        alt.name.toLowerCase() === characterData.name.toLowerCase() && 
        alt.realm === characterData.realm
    );
    
    if (exists) {
        throw new Error('Character already exists');
    }

    this.alts.push(characterData);
    return await this.save();
};

// Static method to get or create user
UserCharacterSchema.statics.getOrCreate = async function(userId, mainCharacter) {
    let user = await this.findOne({ userId });
    if (!user && mainCharacter) {
        user = await this.create({
            userId,
            main: mainCharacter
        });
    }
    return user;
};

module.exports = mongoose.model('UserCharacter', UserCharacterSchema, 'userCharacters'); 