const {
  MessageFlags,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");
const cheerio = require("cheerio");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const itemsDB = require("../../itemsdb.json");
const LanguageManager = require("../../utils/LanguageManager");

// Define an axios instance with rate limit applied
const https = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 4000,
});

// Add this function to check character ownership
const findCharacterOwner = (userCharacters, charName, realm) => {
  for (const userId in userCharacters) {
    const userData = userCharacters[userId];
    
    // Check main character
    if (userData.main && 
        userData.main.name.toLowerCase() === charName.toLowerCase() && 
        userData.main.realm === realm) {
      return { userId, isMain: true };
    }
    
    // Check alt characters
    const alt = userData.alts?.find(alt => 
      alt.name.toLowerCase() === charName.toLowerCase() && 
      alt.realm === realm
    );
    
    if (alt) {
      return { userId, isMain: false };
    }
  }
  return null;
};

module.exports = new ApplicationCommand({
  command: {
    name: "charinfo",
    description: "Gives some information about any character on Warmane.",
    type: 1,
    contexts: [0, 2], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
    options: [
      {
        name: "character",
        description: "Select the character u want Information from.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "realm",
        description: "Select the realm of the character.",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "Icecrown", value: "Icecrown" },
          { name: "Onyxia", value: "Onyxia" },
          { name: "Lordaeron", value: "Lordaeron" },
          { name: "Frostwolf", value: "Frostwolf" },
          { name: "Blackrock", value: "Blackrock" },
        ],
      },
      {
        name: "invisible",
        description: "Is the result invisible for other people?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
  },
  options: {
    cooldown: 10000,
  },
  /**
   *
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const charName = interaction.options.getString("character", true);
    const realm = interaction.options.getString("realm", true);
    let invisible = interaction.options.getBoolean("invisible", false);
    const settings = client.database.get("settings") || [];
    const guildSettings = settings.find(setting => setting.guild === interaction.guildId);
    const lang = guildSettings?.language || 'en';

    const charNameFormatted =
      charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();

    // First, check if the character exists
    try {
      const response = await https.get(
        `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
      );
      const characterData = response.data;

      // If the character does not exist, return an error message
      if (!characterData || !characterData.name) {
        return interaction.reply({
          content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
            character: charNameFormatted
          }),
          flags: [MessageFlags.Ephemeral],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return interaction.reply({
        content: LanguageManager.getText('commands.global_strings.error_occurred', lang, {
          error: error.message
        }),
        flags: [MessageFlags.Ephemeral],
      });
    }

    // Immediately reply to the interaction with a loading state
    await interaction.deferReply({
      content: LanguageManager.getText('commands.charinfo.loading', lang),
      flags: invisible ? [MessageFlags.Ephemeral] : [],
    });

    // Define a function to make the request
    async function makeRequest(url) {
      try {
        const response = await https.get(url);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // HTTP 429 Too Many Requests
          console.log("Too many requests, retrying after 4 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 1 second
          return makeRequest(url); // Retry the request
        } else {
          throw error; // If it's another error, throw it
        }
      }
    }

    // Use the function to make the requests
    const fetchCharacterData = makeRequest(
      `${config.users.url}/api/character/${charNameFormatted}/${realm}/summary`
    );

    const fetchArmoryData = makeRequest(
      `${config.users.url}/character/${charNameFormatted}/${realm}/`
    );

    Promise.all([fetchCharacterData, fetchArmoryData])
      .then(async ([data, body]) => {
        // If the character does not exist, return an error message
        if (!data || !data.name) {
          return interaction.editReply({
            content: LanguageManager.getText('commands.charinfo.char_not_exist', lang, {
              character: charNameFormatted
            }),
            flags: [MessageFlags.Ephemeral],
          });
        }
        const items = data.equipment.map((item) => item.item);

        // Use a Map for faster lookups
        const itemsMap = new Map(
          itemsDB.items.map((item) => [item.itemID, item])
        );

        let totalGearScore = 0;
        let weapons = [];

        for (let item of items) {
          // Look up items in constant time
          const localItem = itemsMap.get(Number(item));

          if (localItem) {
            if (
              localItem.class === 2 &&
              (localItem.subclass === 1 ||
                localItem.subclass === 5 ||
                localItem.subclass === 8)
            ) {
              weapons.push(localItem.GearScore);
            } else {
              totalGearScore += localItem.GearScore;
            }
          }
        }

        // Handle the weapons array
        if (weapons.length === 2) {
          // If there are two weapons, add the average of their gearscores to the total
          totalGearScore += Math.floor((weapons[0] + weapons[1]) / 2);
        } else if (weapons.length === 1) {
          // If there is one weapon, add its gearscore to the total
          totalGearScore += weapons[0];
        }

        // Convert the total gearscore to a string
        const totalGearScoreString = totalGearScore.toString();

        // Find the character in the data
        if (data.name === charNameFormatted) {
          const character = {
            name: data.name,
            realm: data.realm,
            online: data.online,
            level: data.level,
            faction: data.faction,
            gender: data.gender,
            race: data.race,
            class: data.class,
            honorableKills: data.honorablekills,
            guild: data.guild,
            achievementPoints: data.achievementpoints,
            talents: data.talents.map((talent) => talent.tree),
            professions: data.professions,
          };

          // Check if the character has a guild
          if (!character.guild) {
            character.guild = "None";
          }

          function getParams(params) {
            params = params.split("&");
            let paramsMap = {};
            params.forEach(function (p) {
              let v = p.split("=");
              paramsMap[v[0]] = decodeURIComponent(v[1]);
            });
            return paramsMap;
          }

          // Initialize missingGems and missingEnchants arrays
          let missingGems = [];
          let missingEnchants = [];
          const itemNames = [
            "Head",
            "Neck",
            "Shoulders",
            "Cloak",
            "Chest",
            "Shirt",
            "Tabard",
            "Bracer",
            "Gloves",
            "Belt",
            "Legs",
            "Boots",
            "Ring #1",
            "Ring #2",
            "Trinket #1",
            "Trinket #2",
            "Main-hand",
            "Off-hand",
            "Ranged",
          ];
          const bannedItems = [1, 5, 6, 9, 14, 15];

          // Start the HTTP request
          const $ = cheerio.load(body);
          let itemIDs = [];
          let actualItems = [];
          let i = 0;
          let characterClass = $(".level-race-class").text().toLowerCase();
          // map professions to array from data
          let professions = character.professions.map(
            (profession) => profession.name
          );

          // Only check for missing enchants and gems if character is level 80
          const shouldCheckMissing = character.level === 80;

          $(".item-model a").each(function () {
            let rel = $(this).attr("rel");
            if (rel) {
              let params = getParams(rel);
              let amount = params["gems"]
                ? params["gems"].split(":").filter((x) => x !== "0").length
                : 0;

              itemIDs.push({
                itemID: Number(params["item"]),
              });

              actualItems.push({
                itemID: Number(params["item"]),
                gems: amount,
                type: itemNames[i],
              });

              // Only check for missing enchants if character is level 80
              if (shouldCheckMissing && !bannedItems.includes(i)) {
                let isEnchanted = rel.indexOf("ench") !== -1;

                if (!isEnchanted) {
                  if (
                    itemNames[i] === "Ranged" &&
                    character.class.toLowerCase() === "hunter"
                  ) {
                    missingEnchants.push(itemNames[i]);
                  } else if (
                    (itemNames[i] === "Ring #1" ||
                      itemNames[i] === "Ring #2") &&
                    professions.includes("Enchanting")
                  ) {
                    missingEnchants.push(itemNames[i]);
                  } else if (
                    itemNames[i] === "Off-hand" &&
                    !["mage", "warlock", "druid", "priest"].some(
                      (cls) =>
                        cls.toLowerCase() === character.class.toLowerCase()
                    )
                  ) {
                    missingEnchants.push(itemNames[i]);
                  } else if (
                    (itemNames[i] === "Gloves" || itemNames[i] === "Boots") &&
                    !professions.includes("Engineering")
                  ) {
                    missingEnchants.push(itemNames[i]);
                  } else if (
                    !["Ranged", "Ring #1", "Ring #2"].includes(itemNames[i])
                  ) {
                    missingEnchants.push(itemNames[i]);
                  }
                }
              }
              i++;
            }
          });

          let items = itemsDB.items.filter((item) =>
            itemIDs.some((id) => id.itemID === item.itemID)
          );

          // Check if character has Blacksmithing
          const hasBlacksmithing = professions.includes("Blacksmithing");

          // Only check for missing gems if character is level 80
          if (shouldCheckMissing) {
            items.forEach((item) => {
              let foundItem = actualItems.filter(
                (x) => x.itemID === item.itemID
              )[0];
              
              // Skip gem check for Gloves and Bracers if character has Blacksmithing
              if (hasBlacksmithing && (foundItem.type === "Gloves" || foundItem.type === "Bracer")) {
                return;
              }
              
              if (foundItem.type === "Belt") {
                if (item.gems + 1 !== foundItem.gems) {
                  missingGems.push(foundItem.type);
                }
              } else {
                if (item.gems !== foundItem.gems) {
                  missingGems.push(foundItem.type);
                }
              }
            });
          }

          // Switch based on characters Faction icon
          switch (character.faction) {
            case "Alliance":
              character.icon = config.base.iconAlliance;
              break;
            case "Horde":
              character.icon = config.base.iconHorde;
              break;
          }

          // check character race and gender to set thumbnail icon
          switch (character.race) {
            case "Human":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.humanFemale;
                  break;
                case "Male":
                  character.portrait = config.base.humanMale;
                  break;
              }
              break;
            case "Orc":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.orcFemale;
                  break;
                case "Male":
                  character.portrait = config.base.orcMale;
                  break;
              }
              break;
            case "Dwarf":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.dwarfFemale;
                  break;
                case "Male":
                  character.portrait = config.base.dwarfMale;
                  break;
              }
              break;
            case "Night Elf":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.nightElfFemale;
                  break;
                case "Male":
                  character.portrait = config.base.nightElfMale;
                  break;
              }
              break;
            case "Undead":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.undeadFemale;
                  break;
                case "Male":
                  character.portrait = config.base.undeadMale;
                  break;
              }
              break;
            case "Tauren":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.taurenFemale;
                  break;
                case "Male":
                  character.portrait = config.base.taurenMale;
                  break;
              }
              break;
            case "Gnome":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.gnomeFemale;
                  break;
                case "Male":
                  character.portrait = config.base.gnomeMale;
                  break;
              }
              break;
            case "Troll":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.trollFemale;
                  break;
                case "Male":
                  character.portrait = config.base.trollMale;
                  break;
              }
              break;
            case "Blood Elf":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.bloodElfFemale;
                  break;
                case "Male":
                  character.portrait = config.base.bloodElfMale;
                  break;
              }
              break;
            case "Draenei":
              switch (character.gender) {
                case "Female":
                  character.portrait = config.base.draeneiFemale;
                  break;
                case "Male":
                  character.portrait = config.base.draeneiMale;
                  break;
              }
          }

          // Set color based on class
          switch (character.class.toLowerCase()) {
            case "death knight":
              character.color = "#C41E3A";
              break;
            case "druid":
              character.color = "#FF7C0A";
              break;
            case "hunter":
              character.color = "#AAD372";
              break;
            case "mage":
              character.color = "#3FC7EB";
              break;
            case "paladin":
              character.color = "#F48CBA";
              break;
            case "priest":
              character.color = "#FFFFFF";
              break;
            case "rogue":
              character.color = "#FFF468";
              break;
            case "shaman":
              character.color = "#0070DD";
              break;
            case "warlock":
              character.color = "#8788EE";
              break;
            case "warrior":
              character.color = "#C69B6D";
              break;
          }

          if (character) {
            const armoryLink = `${config.users.url}character/${charNameFormatted}/${realm}/`;
            // Create base fields without missing gems/enchants
            const embedFields = [
              {
                name: LanguageManager.getText('commands.charinfo.embed.fields.character', lang),
                value: character.name,
                inline: true
              },
              {
                name: LanguageManager.getText('commands.charinfo.embed.fields.realm', lang),
                value: character.realm,
                inline: true
              },
              {
                name: LanguageManager.getText('commands.charinfo.embed.fields.online', lang),
                value: character.online ? LanguageManager.getText('commands.charinfo.embed.fields.yes', lang) : LanguageManager.getText('commands.charinfo.embed.fields.no', lang),
                inline: true,
              },
              {
                name: LanguageManager.getText('commands.charinfo.embed.fields.level', lang),
                value: character.level.toString(),
                inline: true
              },
              character.guild !== "None" && {
                name: LanguageManager.getText('commands.charinfo.embed.fields.guild', lang),
                value: character.guild,
                inline: true
              },
              character.honorableKills > 0 && {
                name: LanguageManager.getText('commands.charinfo.embed.fields.honorable_kills', lang),
                value: character.honorableKills.toString(),
                inline: true
              },
              character.achievementPoints > 0 && {
                name: LanguageManager.getText('commands.charinfo.embed.fields.achievement_points', lang),
                value: character.achievementPoints.toString(),
                inline: true
              }
            ].filter(Boolean);

            // Add owner information if it exists
            const userCharacters = client.database.get("userCharacters") || {};
            const ownerInfo = findCharacterOwner(userCharacters, character.name, realm);

            if (ownerInfo) {
              embedFields.push({
                name: LanguageManager.getText('commands.charinfo.embed.fields.belongs_to', lang),
                value: `<@${ownerInfo.userId}> (${ownerInfo.isMain ? 'Main' : 'Alt'})`,
                inline: true
              });
            }

            // Add missing gems and enchants after owner info (only for level 80)
            if (shouldCheckMissing) {
              if (missingGems.length > 0) {
                embedFields.push({
                  name: LanguageManager.getText('commands.charinfo.embed.fields.missing_gems', lang),
                  value: missingGems.join(", "),
                  inline: true
                });
              }
              if (missingEnchants.length > 0) {
                embedFields.push({
                  name: LanguageManager.getText('commands.charinfo.embed.fields.missing_enchants', lang),
                  value: missingEnchants.join(", "),
                  inline: true
                });
              }
            }

            const embed = new EmbedBuilder()
              .setColor(character.color || "#8B0000")
              .setTitle(LanguageManager.getText('commands.charinfo.embed.title', lang))
              .setDescription(
                LanguageManager.getText('commands.charinfo.embed.description', lang, {
                  character: charNameFormatted,
                  url: armoryLink
                })
              )
              .setThumbnail(character.portrait)
              .setTimestamp(new Date())
              .setFooter({
                text: interaction.guild?.name ?? "Warmane Tool",
                iconURL: character.icon,
              });

            // Add fields to the embed
            embedFields.forEach((field) => {
              embed.addFields(field);
            });

            // Check if the character has professions
            if (character.professions && character.professions.length > 0) {
              const professions = character.professions
                .map((profession) => `${profession.name}: ${profession.skill}`)
                .join("\n");
              embed.addFields({
                name: LanguageManager.getText('commands.charinfo.embed.fields.professions', lang),
                value: professions,
                inline: true,
              });
            }

            // Check if the character has pvp teams
            if (data.pvpteams && data.pvpteams.length > 0) {
              const pvpteams = data.pvpteams
                .map(
                  (team) =>
                    LanguageManager.getText('commands.charinfo.embed.fields.teams', lang, {
                      type: team.type,
                      name: team.name,
                      rating: team.rating,
                      rank: team.rank
                    })
                )
                .join("\n");
              embed.addFields({
                name: LanguageManager.getText('commands.charinfo.embed.fields.pvp_teams', lang),
                value: pvpteams,
                inline: false,
              });
            }

            await interaction.editReply({
              embeds: [embed],
              flags: invisible ? [MessageFlags.Ephemeral] : [],
            });
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  },
}).toJSON();
