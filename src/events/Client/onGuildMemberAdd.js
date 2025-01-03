const {success} = require("../../utils/Console");
const Event = require("../../structure/Event");

function ensureGuildSettings(guildSettings) {
    const defaultSettings = {
      welcomeMessage: false,
      welcomeChannel: "",
      CharNameAsk: false,
      BlockList: true,
      welcomeMessageDM:
        "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
      lastOwnerDM: {},
        // Add any other default settings here
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
    event: "guildMemberAdd", once: false, run: async (client, member) => {
        // check if the joined ID is blacklisted
        let obj = client.database.get("blacklisted") || [];
        let settings = client.database.get("settings") || [];
        let guildSettings = settings.find((setting) => setting.guild === member.guild.id);
        if (!guildSettings) {
            guildSettings = {guild: member.guild.id};
            settings.push(guildSettings);
        }

        if (ensureGuildSettings(guildSettings)) {
            client.database.set("settings", settings);
        }

        let charNameAskEnabled = guildSettings.CharNameAsk;
        let welcomeMessageEnabled = guildSettings.welcomeMessage;
        let BlockListEnabled = guildSettings.BlockList;
        let welcomeMessageDM = guildSettings.welcomeMessageDM;

        // If the member is a bot, return and do not send any messages
        if (member.user.bot) {
            return;
        }

        if (BlockListEnabled) {
            if (obj.includes(member.id)) {
                try {
                    await member.send("You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff.");
                } catch (error) {
                    console.error(`Failed to send a DM to ${member.tag}.`);
                    return;
                }
                try {
                    await member.kick("Blacklisted user.");
                    success(`Kicked ${member.user.tag} due to being blacklisted.`);
                } catch (error) {
                    console.error(`Failed to kick ${member.user.tag} due to: ${error.message}.`);
                }
                return;
            }
        }

        if (charNameAskEnabled) {
            // CharNameAsk is enabled, proceed with the logic
            try {
                await member.send(welcomeMessageDM);
            } catch (error) {
                console.error(`Failed to send a DM to ${member.user.tag}.`);
                return;
            }
            // wait for the users response to the DM and change his nickname
            const filter = (m) => m.author.id === member.user.id;
            const collector = member.dmChannel.createMessageCollector({
                filter, time: 60000,
            });

            collector.on("collect", async (collected) => {
                let response = collected.content.trim().replace(/[^a-zA-Z ]/g, "");
                if (response === "" || response.length > 16) {
                    await member.dmChannel.send("Your response cannot be empty or too long.\nPlease provide a valid response.");
                } else {
                    try {
                        await member.setNickname(response);
                        console.log(`Changed ${member.user.tag} to ${response}.`);
                        await member.dmChannel.send(`Your name has been successfully changed to ${response} for the Guild ${member.guild.name}.`);
                        collector.stop('valid-response'); // This line ensures the collector stops after a successful operation
                    } catch (error) {
                        console.error(`Failed to change ${member.user.tag} to ${response} due to: ${error.message}.`);
                        await member.dmChannel.send(`Failed to change your name due to: ${error.message}`);
                        // Do not stop the collector here to allow for further attempts
                    }
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason !== 'valid-response') {
                    member.dmChannel.send("Time's up! Contact a staff of the server if you like to change your name again.");
                }
            });
        }

        if (welcomeMessageEnabled) {
            // welcomeMessage is enabled, proceed with the logic
            let welcomeChannel = guildSettings.welcomeChannel;
            if (!welcomeChannel || welcomeChannel === "") {
                welcomeChannel = member.guild.channels.cache.find((channel) => channel.name === "welcome");
            } else {
                welcomeChannel = member.guild.channels.cache.get(welcomeChannel);
            }
            if (!welcomeChannel) return;

            const embed = {
                title: `Welcome to ${member.guild.name}!`,
                description: `Welcome ${member} to our server! \n\nPlease make sure to check your DM's and tell us your main Character name.\nIf you have any questions, feel free to ask in a Public channel.`,
                color: 10038562,
                timestamp: new Date(),
                footer: {
                    text: member.guild.name, icon_url: client.user.displayAvatarURL(),
                },
                thumbnail: {
                    url: member.user.displayAvatarURL(),
                },
            };
            await welcomeChannel.send({embeds: [embed]});
        }
    },
}).toJSON();
