// New utility file for character-related functions
const { https } = require('./HttpClient'); // Move axios instance to separate file
const config = require('../config');

class CharacterUtils {
    static formatCharacterName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    static async verifyCharacter(charName, realm) {
        const url = `${config.users.url}/api/character/${charName}/${realm}/summary`;
        const response = await this.makeRequest(url);
        return response.data?.name ? response.data : null;
    }

    static async fetchCharacterData(charName, realm) {
        const summaryUrl = `${config.users.url}/api/character/${charName}/${realm}/summary`;
        const armoryUrl = `${config.users.url}/character/${charName}/${realm}/`;

        const [summaryResponse, armoryResponse] = await Promise.all([
            this.makeRequest(summaryUrl),
            this.makeRequest(armoryUrl)
        ]);

        if (summaryResponse.data?.error === 'Too many requests.') {
            throw new Error('Rate limited by Warmane API. Please try again in a few seconds.');
        }

        return {
            summary: summaryResponse.data,
            armory: armoryResponse.data
        };
    }

    static calculateGearScore(equipment, itemsMap) {
        let totalGearScore = 0;
        const weapons = [];

        equipment.forEach(item => {
            const localItem = itemsMap.get(Number(item.item));
            if (localItem) {
                if (localItem.class === 2 && [1, 5, 8].includes(localItem.subclass)) {
                    weapons.push(localItem.GearScore);
                } else {
                    totalGearScore += localItem.GearScore;
                }
            }
        });

        if (weapons.length === 2) {
            totalGearScore += Math.floor((weapons[0] + weapons[1]) / 2);
        } else if (weapons.length === 1) {
            totalGearScore += weapons[0];
        }

        return totalGearScore;
    }

    static async findCharacterOwner(client, charName, realm) {
        const userCharacter = await client.getDatabaseHandler().findOne('userCharacters', {
            $or: [
                { 'main.name': { $regex: new RegExp(`^${charName}$`, 'i') }, 'main.realm': realm },
                { 'alts': { 
                    $elemMatch: { 
                        'name': { $regex: new RegExp(`^${charName}$`, 'i') },
                        'realm': realm 
                    }
                }}
            ]
        });

        if (!userCharacter) return null;

        const isMain = userCharacter.main?.name.toLowerCase() === charName.toLowerCase() && 
                     userCharacter.main?.realm === realm;

        return {
            userId: userCharacter.userId,
            isMain: isMain
        };
    }

    static async makeRequest(url, retryCount = 0) {
        const maxRetries = 3;
        const retryDelay = 5000; // 5 seconds delay between retries
        
        try {
            const response = await https.get(url);
            
            if (response.data?.error === 'Too many requests.') {
                console.log(`Rate limited by Warmane API, attempt ${retryCount + 1}/${maxRetries + 1}`);
                if (retryCount < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    return this.makeRequest(url, retryCount + 1);
                }
                throw new Error('Rate limited by Warmane API. Please try again in a few seconds.');
            }
            
            return response;
        } catch (error) {
            // Handle 403 errors specifically
            if (error.isWarmaneBlocked || error.response?.status === 403) {
                throw new Error('Warmane services have blocked this request. Please try again later.');
            }
            
            // Handle rate limiting (429) and service unavailable (503)
            if (error.response?.status === 429 || error.response?.status === 503) {
                console.log(`Rate limited/service unavailable, attempt ${retryCount + 1}/${maxRetries + 1}`);
                if (retryCount < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    return this.makeRequest(url, retryCount + 1);
                }
            }
            
            throw error;
        }
    }
}

module.exports = CharacterUtils; 