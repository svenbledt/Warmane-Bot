const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const LanguageManager = require("../../utils/LanguageManager");
const config = require("../../config");
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

// Define an axios instance with rate limit
const https = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 4000,
});

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
    lastOwnerDM: {},
  };

  let updated = false;

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!guildSettings.hasOwnProperty(key)) {
      guildSettings[key] = value;
      updated = true;
    }
  }

  return updated;
}

// Helper function to check if character is already assigned
const isCharacterAssigned = (userChars, charName, realm) => {
  for (const userId in userChars) {
    const userData = userChars[userId];
    // Check main character
    if (userData.main && 
        userData.main.name.toLowerCase() === charName.toLowerCase() && 
        userData.main.realm === realm) {
      return true;
    }
    // Check alt characters
    if (userData.alts && userData.alts.some(alt => 
        alt.name.toLowerCase() === charName.toLowerCase() && 
        alt.realm === realm)) {
      return true;
    }
  }
  return false;
};

// Helper function to check character exists on Warmane
const checkWarmaneCharacter = async (charName, realm) => {
  try {
    const response = await https.get(
      `${config.users.url}/api/character/${charName}/${realm}/summary`
    );
    return response.data && response.data.name ? true : false;
  } catch (error) {
    return false;
  }
};

module.exports = new Event({
  event: "guildMemberAdd",
  once: false,
  run: async (client, member) => {
    let obj = client.database.get("blacklisted") || [];
    let settings = client.database.get("settings") || [];
    let guildSettings = settings.find(
      (setting) => setting.guild === member.guild.id
    );
    
    if (!guildSettings) {
      guildSettings = { guild: member.guild.id };
      settings.push(guildSettings);
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }

    const lang = guildSettings.language || "en";
    const charNameAskEnabled = guildSettings.CharNameAsk;
    const welcomeMessageEnabled = guildSettings.welcomeMessage;
    const BlockListEnabled = guildSettings.BlockList;

    if (member.user.bot) return;

    // Check if user is blacklisted
    const blacklistedUser = obj.find(u => u.id === member.id);
    if (BlockListEnabled && blacklistedUser) {
      // Skip if this is the Warmane Tool Discord server
      if (member.guild.id === config.development.guildId) {
        return;
      }

      try {
        await member.send(
          LanguageManager.getText('events.guildMemberAdd.blacklisted', lang)
        );
      } catch (error) {
        console.error(`Failed to send a DM to ${member.user.tag}.`);
      }

      try {
        await member.ban({
          reason: `Blacklisted user. Reason: ${blacklistedUser.reason || 'No reason provided'}`,
          deleteMessageSeconds: 60 * 60 * 24 * 7 // 7 days of messages
        });
        success(`Banned ${member.user.tag} due to being blacklisted.`);
      } catch (error) {
        console.error(
          `Failed to ban ${member.user.tag} due to: ${error.message}.`
        );
      }
      return;
    }

    if (charNameAskEnabled) {
      try {
        const dmChannel = await member.createDM();
        
        // Check if user has assigned characters
        const userChars = client.database.get("userCharacters") || {};
        const userData = userChars[member.user.id];
        
        if (userData && (userData.main || (userData.alts && userData.alts.length > 0))) {
          // Create dropdown with assigned characters
          const options = [];
          
          if (userData.main) {
            options.push({
              label: `${userData.main.name} (Main)`,
              description: `Main character - ${userData.main.realm}`,
              value: userData.main.name
            });
          }
          
          if (userData.alts) {
            userData.alts.forEach(alt => {
              options.push({
                label: `${alt.name} (Alt)`,
                description: `Alt character - ${alt.realm}`,
                value: alt.name
              });
            });
          }

          const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('character_select')
              .setPlaceholder(LanguageManager.getText('events.guildMemberAdd.select_character', lang))
              .addOptions(options)
          );

          const selectMessage = await dmChannel.send({
            content: LanguageManager.getText('events.guildMemberAdd.assigned_chars_found', lang),
            components: [row]
          });

          try {
            const response = await selectMessage.awaitMessageComponent({
              filter: i => i.customId === 'character_select' && i.user.id === member.user.id,
              time: 60000,
              componentType: ComponentType.StringSelect
            });

            // Acknowledge the interaction first
            await response.deferUpdate();

            const selectedName = response.values[0];
            try {
              await member.setNickname(selectedName);
              await dmChannel.send(
                LanguageManager.getText('events.guildMemberAdd.name_changed', lang, {
                  nickname: selectedName,
                  guildName: member.guild.name
                })
              );
            } catch (error) {
              console.error(`Failed to change nickname: ${error.message}`);
              await dmChannel.send(
                LanguageManager.getText('events.guildMemberAdd.name_change_failed', lang, {
                  error: error.message
                })
              );
            }
          } catch (error) {
            console.error('Selection error:', error);
            if (error.code === 'INTERACTION_COLLECTOR_ERROR') {
              await dmChannel.send(
                LanguageManager.getText('events.guildMemberAdd.timeout', lang)
              );
            }
          } finally {
            // Disable the select menu after use
            try {
              const disabledRow = new ActionRowBuilder().addComponents(
                StringSelectMenuBuilder.from(row.components[0]).setDisabled(true)
              );
              await selectMessage.edit({ components: [disabledRow] });
            } catch (error) {
              console.error('Failed to disable select menu:', error);
            }
          }
        } else {
          // Manual character name input for users without assigned characters
          await dmChannel.send(guildSettings.charNameAskDM);
          
          const filter = (m) => m.author.id === member.user.id;
          const collector = dmChannel.createMessageCollector({
            filter,
            time: 60000,
          });

          collector.on("collect", async (collected) => {
            let response = collected.content.trim().replace(/[^a-zA-Z ]/g, "");
            if (response === "" || response.length > 16) {
              await dmChannel.send(
                LanguageManager.getText('events.guildMemberAdd.invalid_response', lang)
              );
            } else {
              try {
                await member.setNickname(response);
                console.log(`Changed ${member.user.tag} to ${response}.`);
                await dmChannel.send(
                  LanguageManager.getText('events.guildMemberAdd.name_changed', lang, {
                    nickname: response,
                    guildName: member.guild.name
                  })
                );

                // Check if the character exists on Warmane and isn't assigned
                const realms = ["Icecrown", "Lordaeron", "Frostwolf", "Blackrock", "Onyxia"];
                for (const realm of realms) {
                  const exists = await checkWarmaneCharacter(response, realm);
                  if (exists && !isCharacterAssigned(userChars, response, realm)) {
                    // Initialize user data if it doesn't exist
                    if (!userChars[member.user.id]) {
                      userChars[member.user.id] = {
                        main: null,
                        alts: []
                      };
                    }

                    // Add as alt character
                    const charData = {
                      name: response,
                      realm: realm,
                      addedBy: client.user.id,
                      addedAt: new Date().toISOString()
                    };

                    userChars[member.user.id].alts.push(charData);
                    client.database.set("userCharacters", userChars);
                    break; // Stop checking other realms once we find a match
                  }
                }

                collector.stop("valid-response");
              } catch (error) {
                console.error(
                  `Failed to change ${member.user.tag} to ${response} due to: ${error.message}.`
                );
                await dmChannel.send(
                  LanguageManager.getText('events.guildMemberAdd.name_change_failed', lang, {
                    error: error.message
                  })
                );
              }
            }
          });

          collector.on("end", async (collected, reason) => {
            try {
              if (reason !== "valid-response") {
                await dmChannel.send(
                  LanguageManager.getText('events.guildMemberAdd.timeout', lang)
                );
              }
            } catch (error) {
              console.error(`Failed to send end message to ${member.user.tag}: ${error.message}`);
            }
          });
        }

      } catch (error) {
        console.error(`Failed to interact with ${member.user.tag}: ${error.message}`);
        try {
          const modChannel = member.guild.channels.cache.find(
            channel => channel.name === "mod-logs"
          );
          if (modChannel) {
            await modChannel.send(
              LanguageManager.getText('events.guildMemberAdd.mod_notification', lang, {
                username: member.user.tag
              })
            );
          }
        } catch (err) {
          console.error("Failed to send mod notification:", err);
        }
      }
    }

    if (welcomeMessageEnabled) {
      let welcomeChannel = guildSettings.welcomeChannel;
      if (!welcomeChannel || welcomeChannel === "") {
        welcomeChannel = member.guild.channels.cache.find(
          (channel) => channel.name === "welcome"
        );
      } else {
        welcomeChannel = member.guild.channels.cache.get(welcomeChannel);
      }
      if (!welcomeChannel) return;

      const embed = {
        title: LanguageManager.getText('events.guildMemberAdd.welcome_title', lang, {
          guildName: member.guild.name
        }),
        description: LanguageManager.getText('events.guildMemberAdd.welcome_message', lang, {
          member: member.toString()
        }),
        color: 10038562,
        timestamp: new Date(),
        footer: {
          text: member.guild.name,
          icon_url: client.user.displayAvatarURL(),
        },
        thumbnail: {
          url: member.user.displayAvatarURL(),
        },
      };
      await welcomeChannel.send({ embeds: [embed] });
    }
  },
}).toJSON();
