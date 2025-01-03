const {MessageFlags, UserContextMenuCommandInteraction, PermissionsBitField} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'Ask for Charname',
        type: 2,
    },
    options: {
        cooldown: 5000,
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {UserContextMenuCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const member = interaction.targetMember;
        if (!interaction.targetMember.permissions.has([PermissionsBitField.Flags.Administrator])) {
            await interaction.reply({
                content: `You don't have the required permissions to use this command.`,
                flags: [MessageFlags.Ephemeral],
            });
            return;
        }
        if (!member) {
            await interaction.reply({
                content: `Invalid target!`
            });

            return;
        }

        // Send message to the user and await for his response with his character main name
        try {
            await member.send('Hey, I would like to ask you for your main Character name. Please respond with your main Character name.')
        } catch (error) {
            console.error(`Failed to send a DM to ${member.tag}.`);
            await interaction.reply({
                content: `Failed to send a DM to ${member.tag}.`, flags: [MessageFlags.Ephemeral]
            });
            return;
        }
        // Reply to the interaction
        try {
            await interaction.reply({
                content: 'I have asked the user for his Character name.', flags: [MessageFlags.Ephemeral]
            });
        } catch (error) {
            console.error(`Failed to reply to the interaction.`);
            return;
        }
        // Await for users response to the DM and change his nickname
        const filter = m => m.author.id === member.id;
        if (!member.dmChannel) {
            member.createDM().then(dmChannel => {
                dmChannel.awaitMessages({filter, max: 1, time: 60000, errors: ['time']})
                    .then(collected => {
                        let response = collected.first().content;
                        // Replace special characters and numbers
                        response = response.replace(/[^a-zA-Z ]/g, "");
                        if (response.trim() === "") {
                            dmChannel.send("Your response cannot be empty. Please provide a valid response.");
                        } else {
                            member.setNickname(response)
                                .then(() => {
                                    console.log(`Changed ${member.user.tag} nickname to ${response}.`);
                                    dmChannel.send(`Your main Characters name has been successfully changed to ${response}.`);
                                })
                                .catch(error => {
                                    console.error(`Failed to change ${member.user.tag} nickname to ${response}.`);
                                    dmChannel.send(`Failed to change your main Characters name due to: ${error.message}`);
                                });
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to get a response from ${member.user.tag}.`);
                    });
            }).catch(error => {
                console.error(`Failed to create a DM channel with ${member.user.tag}.`);
            });
        } else {
            member.dmChannel.awaitMessages({filter, max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    let response = collected.first().content;
                    // Replace special characters and numbers
                    response = response.replace(/[^a-zA-Z ]/g, "");
                    if (response.trim() === "") {
                        member.dmChannel.send("Your response cannot be empty. Please provide a valid response.");
                    } else {
                        member.setNickname(response)
                            .then(() => {
                                console.log(`Changed ${member.user.tag} nickname to ${response}.`);
                                member.dmChannel.send(`Your main Characters name has been successfully changed to ${response}.`);
                            })
                            .catch(error => {
                                console.error(`Failed to change ${member.user.tag} nickname to ${response}.`);
                                member.dmChannel.send(`Failed to change your main Characters name due to: ${error.message}`);
                            });
                    }
                })
                .catch(error => {
                    console.error(`Failed to get a response from ${member.user.tag}.`);
                });
        }
    }
}).toJSON();