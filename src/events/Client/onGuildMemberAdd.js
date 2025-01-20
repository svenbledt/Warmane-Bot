const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const LanguageManager = require("../../utils/LanguageManager");

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

    if (BlockListEnabled && obj.includes(member.id)) {
      try {
        await member.send(
          LanguageManager.getText('events.guildMemberAdd.blacklisted', lang)
        );
      } catch (error) {
        console.error(`Failed to send a DM to ${member.tag}.`);
        return;
      }
      try {
        await member.kick("Blacklisted user.");
        success(`Kicked ${member.user.tag} due to being blacklisted.`);
      } catch (error) {
        console.error(
          `Failed to kick ${member.user.tag} due to: ${error.message}.`
        );
      }
      return;
    }

    if (charNameAskEnabled) {
      try {
        const dmChannel = await member.createDM();
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
