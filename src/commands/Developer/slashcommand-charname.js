const {ChatInputCommandInteraction, ApplicationCommandOptionType} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'charname', description: 'Ask\'s someone for his Character name.', type: 1, options: [{
            name: 'user',
            description: 'The user to ask for his Charname.',
            type: ApplicationCommandOptionType.User,
            required: true,
        }],
    }, options: {
        botDevelopers: true
    }, /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        // Get the member from the interaction that was selected
        const user = interaction.options.getUser('user', true);
        const member = interaction.guild.members.cache.get(user.id);
        // Send a message to the user on DM
        try {
            await member.send('Hey, I would like to ask you for your main Character name. Please respond with your main Character name.')
        } catch (error) {
            console.error(`Failed to send a DM to ${member.tag}.`);
            await interaction.reply({
                content: `Failed to send a DM to ${member.tag}.`, ephemeral: true
            });
            return;
        }
        // Reply to the interaction
        try {
            await interaction.reply({
                content: 'I have asked the user for his Character name.', ephemeral: true
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