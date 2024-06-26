const {success} = require("../../utils/Console");
const Event = require("../../structure/Event");

function ensureGuildSettings(guildSettings) {
    const defaultSettings = {
        welcomeMessage: false,
        welcomeChannel: "",
        CharNameAsk: false,
        BlockList: true,
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
    event: "guildMemberAdd",
    once: false,
    run: async (client, member) => {
        // check if the joined ID is blacklisted
        let obj = client.database.get("blacklisted") || [];
        let settings = client.database.get("settings") || [];
        let guildSettings = settings.find(setting => setting.guild === member.guild.id);
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

        if (BlockListEnabled) {
            if (obj.includes(member.id)) {
                try {
                    await member.send(
                        "You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff."
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
        }

        if (charNameAskEnabled) {
            // CharNameAsk is enabled, proceed with the logic
            try {
                await member.send(
                    `Hey, I would like to ask you for your main Character name. Please respond with your main Character name for the Server ${member.guild.name}`
                );
            } catch (error) {
                console.error(`Failed to send a DM to ${member.user.tag}.`);
                return;
            }
            // wait for the users response to the DM and change his nickname
            const filter = (m) => m.author.id === member.user.id;
            const collector = member.dmChannel.createMessageCollector({
                filter,
                time: 60000,
            });
            collector.on("collect", async (collected) => {
                let response = collected.content;
                // Replace special characters and numbers
                response = response.replace(/[^a-zA-Z ]/g, "");
                if (response.trim() === "" || response.length > 16) {
                    member.dmChannel.send(
                        "Your response cannot be empty or too long. Please provide a valid response."
                    );
                } else {
                    member
                        .setNickname(response)
                        .then(() => {
                            console.log(
                                `Changed ${member.user.tag} main character to ${response}.`
                            );
                            member.dmChannel.send(
                                `Your main Characters name has been successfully changed to ${response} for the Guild ${member.guild.name}.`
                            );
                        })
                        .catch((error) => {
                            console.error(
                                `Failed to change ${member.user.tag} main character to ${response} due to: ${error.message}.`
                            );
                            member.dmChannel.send(
                                `Failed to change your main Characters name due to: ${error.message}`
                            );
                        });
                }
            });
        }

        if (welcomeMessageEnabled) {
            // welcomeMessage is enabled, proceed with the logic
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
                title: `Welcome to ${member.guild.name}!`,
                description: `Welcome ${member} to our server! \n\nPlease make sure to check your DM's and tell us your main Character name.\nIf you have any questions, feel free to ask in a Public Guild channel.`,
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
            await welcomeChannel.send({embeds: [embed]});
        }


    },
}).toJSON();
