module.exports = {
    commands: {
        global_strings: {
            no_permission: "You don't have the required permissions to use this command.",
            invalid_target: "Invalid target!",
            dm_failed: "Failed to send a DM to {username}.",
            dm_sent: "DM sent to {username}.",
            guild_only: "This command can only be used in a server.",
            error_occurred: "An error occurred: {error}"
        },
        charname: {
            dm_initial: "Hey, I would like to ask you for your main Character name. Please respond with your main Character name.",
            empty_response: "Your response cannot be empty. Please provide a valid response.",
            nickname_success: "Your main Characters name has been successfully changed to {nickname}.",
            nickname_failed: "Failed to change your main Characters name due to: {error}"
        },
        language: {
            success: "✅ Server language has been set to {language}."
        },
        globalcheck: {
            no_blacklisted: "There are no blacklisted users.",
            no_blacklisted_guild: "There are no blacklisted users in the guild.",
            not_for_you: "These buttons are not for you!",
            embed_title: "Blacklisted Users",
            blacklisted_user: "ID: <@{userId}>\nReason: {reason}"
        },
        report: {
            modal: {
                title: "Report User",
                username_label: "Username of reported user?",
                username_placeholder: "Enter the username/discord id here!",
                reason_label: "Reason",
                reason_placeholder: "Enter the reason here!",
                evidence_label: "Provide your evidence.",
                evidence_placeholder: "https://imgur.com/blablabla!"
            }
        },
        poll: {
            question_missing: "Poll question is missing.",
            answer_too_long: "One of the answers exceeds the 55 character limit: \"{answer}\"",
            min_answers: "At least two answers are required.",
            creation_failed: "Failed to send a poll to the channel: {error}",
            created_pinned: "Your Poll has been created and pinned!",
            created: "Your Poll has been created!"
        },
        charinfo: {
            loading: "We're looking for your data. Please be patient.",
            char_not_exist: "The character {character} does not exist.",
            embed: {
                title: "Character Information",
                description: "Information about {character} - [Armory]({url})",
                fields: {
                    character: "Character",
                    realm: "Realm",
                    online: "Online",
                    level: "Level",
                    yes: "Yes",
                    no: "No",
                    gender: "Gender",
                    race: "Race",
                    class: "Class",
                    faction: "Faction",
                    honorable_kills: "Honorable Kills",
                    guild: "Guild",
                    achievement_points: "Achievement Points",
                    talents: "Talents",
                    no_guild: "None",
                    pvp_teams: "PvP Teams",
                    gearscore: "GearScore",
                    missing_gems: "Missing Gems",
                    missing_enchants: "Missing Enchants",
                    none: "None",
                    professions: "Professions",
                    teams: "PvP Teams ({type}): {name} (Rating: {rating}, Rank: {rank})"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "The welcome DM is not enabled.",
            updated: "The welcome message has been updated."
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
            welcome_message: "Welcome {member} to our server!\n\nIf you have any questions, feel free to ask in a Public channel.",
            log_kicked: "Kicked {username} due to being blacklisted.",
            log_kick_failed: "Failed to kick {username} due to: {error}",
            log_dm_failed: "Failed to send a DM to {username}.",
            log_name_changed: "Changed {username} to {nickname}.",
            log_name_change_failed: "Failed to change {username} to {nickname} due to: {error}",
            log_end_message_failed: "Failed to send end message to {username}: {error}",
            log_interaction_failed: "Failed to interact with {username}: {error}",
            log_mod_notification_failed: "Failed to send mod notification: {error}"
        }
    }
};