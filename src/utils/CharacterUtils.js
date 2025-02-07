// New utility file for character-related functions
const { https } = require('./HttpClient'); // Move axios instance to separate file
const config = require('../config');

class CharacterUtils {
    static formatCharacterName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    static async verifyCharacter(charName, realm) {
        const response = await https.get(
            `${config.users.url}/api/character/${charName}/${realm}/summary`
        );
        return response.data?.name ? response.data : null;
    }

    static async fetchCharacterData(charName, realm) {
        const [summaryData, armoryData] = await Promise.all([
            https.get(`${config.users.url}/api/character/${charName}/${realm}/summary`),
            https.get(`${config.users.url}/character/${charName}/${realm}/`)
        ]);
        return {
            summary: summaryData.data,
            armory: armoryData.data
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

    static async makeRequest(url) {
        try {
            const response = await https.get(url);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Too many requests, retrying after 4 seconds...');
                await new Promise((resolve) => setTimeout(resolve, 4000));
                return this.makeRequest(url);
            }
            throw error;
        }
    }
}

module.exports = CharacterUtils; 