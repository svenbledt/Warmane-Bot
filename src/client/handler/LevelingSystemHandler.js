const { error, success, info } = require("../../utils/Console");
const LevelingProgress = require('../../models/LevelingProgress');

class LevelingSystemHandler {
    /**
     * @param {DiscordBot} client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Calculate XP needed for next level
     * @param {number} level Current level
     * @returns {number} XP needed for next level
     */
    calculateXPForNextLevel(level) {
        // Basic formula: 100 * level * 1.5
        return Math.floor(100 * level * 3);
    }

    /**
     * Add XP to user
     * @param {string} guildId Guild ID
     * @param {string} userId User ID
     * @param {number} xpAmount Amount of XP to add
     * @returns {Promise<{newLevel: number, leveledUp: boolean, currentXP: number}>}
     */
    async addXP(guildId, userId, xpAmount) {
        try {
            // Find and update in one operation using findOneAndUpdate
            let userProgress = await LevelingProgress.findOneAndUpdate(
                { guild: guildId, user: userId },
                { $inc: { xp: xpAmount } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            const oldLevel = userProgress.level;
            let leveledUp = false;

            // Check for level up
            while (userProgress.xp >= this.calculateXPForNextLevel(userProgress.level)) {
                userProgress.xp -= this.calculateXPForNextLevel(userProgress.level);
                userProgress.level += 1;
                leveledUp = true;
            }

            if (leveledUp) {
                // Only save if level changed
                await LevelingProgress.findOneAndUpdate(
                    { guild: guildId, user: userId },
                    { $set: { level: userProgress.level, xp: userProgress.xp } }
                );
            }

            return {
                newLevel: userProgress.level,
                leveledUp,
                currentXP: userProgress.xp,
                oldLevel
            };
        } catch (err) {
            error('Error adding XP:', err);
            throw err;
        }
    }

    /**
     * Remove XP from user
     * @param {string} guildId Guild ID
     * @param {string} userId User ID
     * @param {number} xpAmount Amount of XP to remove
     * @returns {Promise<{newLevel: number, leveledDown: boolean, currentXP: number}>}
     */
    async removeXP(guildId, userId, xpAmount) {
        try {
            let userProgress = await LevelingProgress.findOneAndUpdate(
                { guild: guildId, user: userId },
                { $inc: { xp: -xpAmount } },
                { new: true }
            );
            
            if (!userProgress) return null;

            const oldLevel = userProgress.level;
            let leveledDown = false;

            // Handle negative XP and level down
            while (userProgress.xp < 0 && userProgress.level > 1) {
                userProgress.level -= 1;
                userProgress.xp += this.calculateXPForNextLevel(userProgress.level);
                leveledDown = true;
            }

            // Ensure XP doesn't go below 0 at level 1
            if (userProgress.level === 1 && userProgress.xp < 0) {
                userProgress.xp = 0;
            }

            if (leveledDown || userProgress.xp === 0) {
                await LevelingProgress.findOneAndUpdate(
                    { guild: guildId, user: userId },
                    { $set: { level: userProgress.level, xp: userProgress.xp } }
                );
            }

            return {
                newLevel: userProgress.level,
                leveledDown,
                currentXP: userProgress.xp,
                oldLevel
            };
        } catch (err) {
            error('Error removing XP:', err);
            throw err;
        }
    }

    /**
     * Add voice time and calculate XP
     * @param {string} guildId Guild ID
     * @param {string} userId User ID
     * @param {number} duration Voice duration in milliseconds
     * @returns {Promise<{xpGained: number, totalVoiceTime: number}>}
     */
    async addVoiceTime(guildId, userId, duration) {
        try {
            // Calculate XP (1 XP per minute)
            const xpGained = Math.floor(duration / (1000 * 60));

            // Update voice time and XP in one operation
            const userProgress = await LevelingProgress.findOneAndUpdate(
                { guild: guildId, user: userId },
                {
                    $inc: { voiceTime: duration },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            // Add XP if any gained
            if (xpGained > 0) {
                await this.addXP(guildId, userId, xpGained);
            }

            return {
                xpGained,
                totalVoiceTime: userProgress.voiceTime
            };
        } catch (err) {
            error('Error adding voice time:', err);
            throw err;
        }
    }

    async addMessage(guildId, userId) {
        try {
            const xpGained = 5;
            await this.addXP(guildId, userId, xpGained);
        } catch (err) {
            error('Error adding message:', err);
            throw err;
        }
    }

    /**
     * Get user's rank in guild
     * @param {string} guildId Guild ID
     * @param {string} userId User ID
     */
    async getUserRank(guildId, userId) {
        const userProgress = await LevelingProgress.findOne({ guild: guildId, user: userId });
        if (!userProgress) return null;

        const rank = await LevelingProgress.countDocuments({
            guild: guildId,
            $or: [
                { level: { $gt: userProgress.level } },
                {
                    level: userProgress.level,
                    xp: { $gt: userProgress.xp }
                }
            ]
        });

        return rank + 1;
    }

    /**
     * Get guild leaderboard
     * @param {string} guildId Guild ID
     * @param {number} limit Number of users to return
     */
    async getLeaderboard(guildId, limit = 10) {
        return await LevelingProgress.find({ guild: guildId })
            .sort({ level: -1, xp: -1 })
            .limit(limit);
    }
}

module.exports = LevelingSystemHandler; 