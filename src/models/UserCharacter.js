const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    realm: { type: String, required: true },
    class: { type: String },
    race: { type: String },
    level: { type: Number },
    guild: { type: String }
});

const userCharacterSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    main: characterSchema,
    alts: [characterSchema]
}, {
    timestamps: true,
    strict: false
});

// Add static method for getting or creating user character
userCharacterSchema.statics.getOrCreate = async function(userId, mainCharacter = null) {
    let userChar = await this.findOne({ userId });
    if (!userChar) {
        userChar = await this.create({
            userId,
            main: mainCharacter,
            alts: []
        });
    }
    return userChar;
};

const UserCharacter = mongoose.model('UserCharacter', userCharacterSchema);

module.exports = UserCharacter; 