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
            dm_initial: "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\nYou have 10 minutes to respond.",
            empty_response: "Your response cannot be empty. Please provide a valid response.",
            nickname_success: "Your main Characters name has been successfully changed to {nickname}.",
            nickname_failed: "Failed to change your main Characters name due to: {error}",
            dm_timeout_message: "Time expired. Please contact a staff member of {guildName} to get a new chance."
        },
        globalcheck: {
            no_blacklisted: "There are no blacklisted users.",
            no_blacklisted_guild: "There are no blacklisted users in the guild.",
            not_for_you: "These buttons are not for you!",
            embed_title: "Blacklisted Users",
            blacklisted_user: "ID: <@{userId}>\nReason: {reason}",
            BUTTONS: {
                KICK: "Kick them",
                BAN: "Ban them",
                NOTHING: "Do nothing"
            },
            ACTION_RESULTS: {
                KICKED: "Successfully kicked {COUNT} members",
                BANNED: "Successfully banned {COUNT} members",
                NOTHING: "No action taken",
                FAILED: "Failed to process {COUNT} members"
            }
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
                    teams: "PvP Teams ({type}): {name} (Rating: {rating}, Rank: {rank})",
                    belongs_to: "Belongs to"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "The welcome DM is not enabled.",
            updated: "The welcome message has been updated."
        },
        servertime: {
            embed: {
                title: "Servertime",
                description: "The current servertime is: {time}",
                footer: "Requested by: {user}"
            }
        },
        setwelcomechannel: {
            channel_set: "The welcome channel has been set to {channel}.",
            error: "Failed to set the welcome channel due to: {error}"
        },
        help: {
            EMBED: {
                TITLE: "Available Commands",
                DESCRIPTION: "Here's a list of all available commands and their descriptions:",
                FOOTER: "Requested by {USER_TAG}"
            },
            NO_DESCRIPTION: "No description available",
            BUTTONS: {
                PREVIOUS: "Previous",
                NEXT: "Next"
            }
        },
        setchar: {
            char_not_exist: "The character {character} does not exist on Warmane.",
            char_already_assigned: "The character {character} is already assigned to {user}.",
            already_has_main: "{user} already has a main character: {character} ({realm}). If this is a mistake, contact a staff member at our [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "Successfully set {character} ({realm}) as {type} character for {user}.",
            success: "Successfully set {character} ({realm}) as main character for {user}.",
            success_updated: "Updated main character for {user} from {oldCharacter} to {character} ({realm})."
        },
        charlist: {
            embed: {
                title: "Characters for {username}",
                no_characters: "No characters found for this user.",
                main_character: "**Main Character:**\n{name} - {realm}",
                alt_characters_header: "**Alt Characters:**",
                character_entry: "{name} - {realm}"
            }
        },
        level: {
            no_progress: "No leveling progress found for this user.",
            level_up: "🎉 Hey {user} you have reached level {level}! Congratulations! 🎉",
            disabled: "The leveling system is disabled on this server."
        },
        setup: {
            title: "Server Settings",
            description: "Configure your server settings by clicking the buttons below. Each setting controls different aspects of the bot's functionality.",
            no_permission: "You need to be an administrator or developer to use this command.",
            no_button_permission: "You need to be an administrator or developer to use these settings.",
            different_user: "You cannot interact with someone else's settings menu. Please use the /settings command to open your own.",
            save_failed: "Failed to update settings. Please try again.",
            menu_expired: "Settings menu has expired.",
            footer: "Settings will automatically save when toggled • Interface times out after 5 minutes",
            features: {
                welcome_message: {
                    name: "👋 Welcome Message",
                    description: "When enabled, the bot will send a welcome message to new members in the configured welcome channel."
                },
                char_name_ask: {
                    name: "👤 Character Name Ask",
                    description: "When enabled, the bot will automatically DM new members asking for their character name and update their nickname accordingly."
                },
                block_list: {
                    name: "🚫 Block List",
                    description: "When enabled, the bot uses the global Blacklist to ban members that are on the list."
                },
                logging: {
                    name: "📝 Logging",
                    description: "When enabled, the bot will log important events that are executed by the bot in relation to your server."
                },
                language: {
                    name: "🌍 Language",
                    description: "Change the language that the bot uses on your server.",
                    current: "Current language: {language}"
                },
                char_name: {
                    name: "👤 Character Name",
                    description: "Configure character name settings for your server."
                },
                status: {
                    enabled: "✅ Enabled",
                    disabled: "❌ Disabled",
                    channel: "Channel: {channel}"
                },
                leveling: {
                    name: "📊 Leveling System",
                    description: "Configure the leveling system for your server."
                }
            },
            buttons: {
                welcome_message: "Welcome Message",
                char_name_ask: "Character Name Ask",
                block_list: "Block List",
                logging: "Logging",

                change_language: "Change Language",
                select_language: "Select a language",
                edit_charname_dm: "Edit Character Name DM",
                leveling: "Leveling System"
            },
            select_log_channel: "Select logging channel",
            select_welcome_channel: "Select welcome channel",
            select_leveling_channel: "Select leveling channel",
            log_channel_set: "✅ Logging channel has been set to {channel}",
            not_set: "Not set",
            language_set: "✅ Server language has been set to {language}",
            leveling_channel_set: "✅ Leveling channel has been set to {channel}",
            welcome_channel_set: "✅ Welcome channel has been set to {channel}",
            charname_dm_modal: {
                title: "Edit Character Name DM Message",
                message_label: "DM Message",
                message_placeholder: "Enter the message to send when asking for character name..."
            },
            charname_dm_updated: "✅ Character name DM message has been updated",
            select_log_channel: "Select logging channel",
            error_occurred: "An error occurred: {error}"
        },
        account: {
            embed: {
                description: "Account information and statistics",
                fields: {
                    account_info_title: "👤 Account Information",
                    username: "Username",
                    displayName: "Display Name",
                    id: "ID",
                    created: "Created",
                    joined: "Joined Server",
                    
                    activity_title: "📊 Activity Stats",
                    accountStanding: "Account Standing",
                    accountLevel: "Level",
                    accountXP: "Experience",
                    xpProgress: "Level Progress",
                    voiceTime: "Voice Time",
                    serverProgress: "Server Progress",
                    serverLevel: "Server Level",
                    serverXP: "Server XP",
                    
                    roles_title: "🎭 Roles [{count}]",
                    
                    badges_title: "🏅 Badges",
                    
                    tiers: {
                        veteran: "🔱 Artifact",
                        diamond: "💎 Legendary",
                        gold: "🥇 Epic",
                        silver: "🥈 Rare",
                        bronze: "🥉 Common"
                    }
                },
                footer: "Account Information • {guildName}"
            }
        }
    },

    events: {
        guildMemberAdd: {
            blacklisted: "You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff. Or appeal at https://discord.gg/YDqBQU43Ht",
            charname_ask: "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.",
            invalid_response: "Your response cannot be empty or too long.\nPlease provide a valid response.",
            name_changed: "Your name has been successfully changed to {nickname} for the Guild {guildName}.",
            name_change_failed: "Failed to change your name due to: {error}",
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
            log_mod_notification_failed: "Failed to send mod notification: {error}",
            select_character: "Select one of your characters",
            assigned_chars_found: "I found some characters assigned to your account. Please select one to use as your nickname:",
            not_on_list_label: "Not on the list",
            not_on_list_description: "Enter a different character name manually",
            character_not_found: "I couldn't find that character. Please try again with a valid character name.",
        }
    },
    logging: {
        error: 'Error',
        leveling_progress_removed: {
            title: 'Leveling Progress Removed',
            description: 'Leveling progress removed for {username}, {userId}>'
        },
        dm_sent: {
            title: 'DM Sent',
            description: 'Sent character name request DM to {username}'
        },
        member_banned: {
            title: 'Member Banned',
            description: 'Banned blacklisted user',
            reason_label: 'Reason'
        },
        invite_created: {
            title: 'Invite Created',
            description: 'Created new server invite for {botName} Developers',
            channel: 'Channel',
            created_by: 'Created By'
        },
        footer: 'Server Logs',
        dm: {
            title: 'DM Failed',
            description: 'Failed to send DM to {username}',
            user_label: 'User',
            user_id: 'User ID',
            error_label: 'Error',
            response: 'Response',
            reason_label: 'Reason'
        },
        nickname_changed: {
            title: 'Nickname Changed',
            description: 'Changed nickname for {username} to {nickname}',
            new_nickname: 'New Nickname'
        },
        dm_timeout: {
            title: 'DM Response Timeout',
            description: '{username} did not respond within the time limit'
        },
        interaction_failed: {
            title: 'Interaction Failed',
            description: 'Failed to interact with {username}'
        }
    }
};