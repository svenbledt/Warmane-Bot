const { error } = require('../../utils/Console');

class BlacklistedWordsHandler {
    constructor(client) {
        this.client = client;
        this.cache = new Map();
        this.initialized = false;
    }

    async initialize() {
        try {
            const words = await this.client.getDatabaseHandler().find('blacklistedWords', {});
            this.cache.clear();
            words.forEach(word => {
                this.cache.set(word.word.toLowerCase(), word);
            });
            this.initialized = true;
        } catch (err) {
            error('Error initializing blacklisted words:', err);
            throw err;
        }
    }

    async addWord(word, points, addedBy, reason) {
        try {
            const normalizedWord = word.toLowerCase();
            const newWord = await this.client.getDatabaseHandler().create('blacklistedWords', {
                word: normalizedWord,
                points,
                addedBy,
                reason
            });
            this.cache.set(normalizedWord, newWord);
            return newWord;
        } catch (err) {
            error('Error adding blacklisted word:', err);
            throw err;
        }
    }

    async removeWord(word) {
        try {
            const normalizedWord = word.toLowerCase();
            await this.client.getDatabaseHandler().deleteOne('blacklistedWords', { word: normalizedWord });
            this.cache.delete(normalizedWord);
        } catch (err) {
            error('Error removing blacklisted word:', err);
            throw err;
        }
    }

    async getWord(word) {
        try {
            const normalizedWord = word.toLowerCase();
            return this.cache.get(normalizedWord);
        } catch (err) {
            error('Error getting blacklisted word:', err);
            throw err;
        }
    }

    async getAllWords() {
        try {
            return Array.from(this.cache.values());
        } catch (err) {
            error('Error getting all blacklisted words:', err);
            throw err;
        }
    }

    checkMessage(message) {
        if (!this.initialized) return null;

        const words = message.toLowerCase().split(/\s+/);
        const foundWords = [];

        for (const word of words) {
            const blacklistedWord = this.cache.get(word);
            if (blacklistedWord) {
                foundWords.push(blacklistedWord);
            }
        }

        return foundWords;
    }
}

module.exports = BlacklistedWordsHandler; 