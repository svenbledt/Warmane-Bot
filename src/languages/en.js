module.exports = {
    commands: {
        charname: {
            no_permission: "You don't have the required permissions to use this command.",
            invalid_target: "Invalid target!",
            dm_initial: "Hey, I would like to ask you for your main Character name. Please respond with your main Character name.",
            dm_failed: "Failed to send a DM to {username}.",
            dm_sent: "I have asked the user for his Character name.",
            empty_response: "Your response cannot be empty. Please provide a valid response.",
            nickname_success: "Your main Characters name has been successfully changed to {nickname}.",
            nickname_failed: "Failed to change your main Characters name due to: {error}"
        },
        language: {
            no_permission: "You don't have the required permissions to use this command.",
            success: "✅ Server language has been set to {language}."
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff. Or appeal at https://discord.gg/YDqBQU43Ht",
            charname_ask: "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
            invalid_response: "Your response cannot be empty or too long.\nPlease provide a valid response.",
            name_changed: "Your name has been successfully changed to {nickname} for the Guild {guildName}.",
            name_change_failed: "Failed to change your name due to: {error}",
            timeout: "Time's up! Contact a staff of the server if you like to change your name again.",
            mod_notification: "Failed to send character name request to {username}. They likely have DMs disabled.",
            welcome_title: "Welcome to {guildName}!",
            welcome_message: "Welcome {member} to our server!\n\nIf you have any questions, feel free to ask in a Public channel."
        }
    }
}; 