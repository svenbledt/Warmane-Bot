module.exports = {
    commands: {
        global_strings: {
            no_permission: 'You don\'t have the required permissions to use this command.',
            invalid_target: 'Invalid target!',
            dm_failed: 'Failed to send a DM to {username}.',
            dm_sent: 'DM sent to {username}.',
            guild_only: 'This command can only be used in a server.',
            not_in_guild: 'This command can only be used in a server.',
            error_occurred: 'An error occurred: {error}',
            user_not_found: 'User not found.',
            bot_developer_only: 'This command is only available to bot developers.',
            warmane_blocked: 'Warmane services have blocked this request. Please try again later.'
        },
        charname: {
            dm_initial: 'Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\nYou have 10 minutes to respond.',
            empty_response: 'Your response cannot be empty. Please provide a valid response.',
            nickname_success: 'Your main Characters name has been successfully changed to {nickname}.',
            nickname_failed: 'Failed to change your main Characters name due to: {error}',
            dm_timeout_message: 'Time expired. Please contact a staff member of {guildName} to get a new chance.',
            warmane_blocked: 'Warmane services are currently unavailable. Please try again later or contact a staff member.'
        },
        globalcheck: {
            no_blacklisted: 'There are no blacklisted users.',
            no_blacklisted_guild: 'There are no blacklisted users in the guild.',
            not_for_you: 'These buttons are not for you!',
            embed_title: 'Blacklisted Users',
            blacklisted_user: 'ID: <@{userId}>\nReason: {reason}',
            BUTTONS: {
                KICK: 'Kick them',
                BAN: 'Ban them',
                NOTHING: 'Do nothing'
            },
            ACTION_RESULTS: {
                KICKED: 'Successfully kicked {COUNT} members',
                BANNED: 'Successfully banned {COUNT} members',
                NOTHING: 'No action taken',
                FAILED: 'Failed to process {COUNT} members'
            },
            navigation: {
                previous: 'Previous',
                next: 'Next'
            }
        },
        report: {
            modal: {
                title: 'Report User',
                username_label: 'Username of reported user?',
                username_placeholder: 'Enter the username/discord id here!',
                reason_label: 'Reason',
                reason_placeholder: 'Enter the reason here!',
                evidence_label: 'Provide your evidence.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            },
            submitted: 'Your report has been submitted. Thank you for helping us keep the server safe.',
            report_title: 'User Report',
            reported_user: 'Reported User',
            reason: 'Reason',
            evidence: 'Evidence',
            reporter_id: 'ReporterID',
            submitted_by: 'Report submitted by {user}',
            send_failed: 'Failed to send the report to the Moderation channel.'
        },
        poll: {
            question_missing: 'Poll question is missing.',
            answer_too_long: 'One of the answers exceeds the 55 character limit: "{answer}"',
            min_answers: 'At least two answers are required.',
            creation_failed: 'Failed to send a poll to the channel: {error}',
            created_pinned: 'Your Poll has been created and pinned!',
            created: 'Your Poll has been created!'
        },
        charinfo: {
            loading: 'We\'re looking for your data. Please be patient.',
            char_not_exist: 'The character {character} does not exist.',
            embed: {
                title: 'Character Information',
                description: 'Information about {character} - [Armory]({url})',
                fields: {
                    character: 'Character',
                    realm: 'Realm',
                    online: 'Online',
                    level: 'Level',
                    yes: 'Yes',
                    no: 'No',
                    gender: 'Gender',
                    race: 'Race',
                    class: 'Class',
                    faction: 'Faction',
                    honorable_kills: 'Honorable Kills',
                    guild: 'Guild',
                    achievement_points: 'Achievement Points',
                    talents: 'Talents',
                    no_guild: 'None',
                    pvp_teams: 'PvP Teams',
                    gearscore: 'GearScore',
                    missing_gems: 'Missing Gems',
                    missing_enchants: 'Missing Enchants',
                    none: 'None',
                    professions: 'Professions',
                    teams: 'PvP Teams ({type}): {name} (Rating: {rating}, Rank: {rank})',
                    belongs_to: 'Belongs to'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'The welcome DM is not enabled.',
            updated: 'The welcome message has been updated.'
        },
        servertime: {
            embed: {
                title: 'Servertime',
                description: 'The current servertime is: {time}',
                footer: 'Requested by: {user}'
            },
            error: 'An error occurred while fetching the server time.'
        },
        setwelcomechannel: {
            channel_set: 'The welcome channel has been set to {channel}.',
            error: 'Failed to set the welcome channel due to: {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Available Commands',
                DESCRIPTION: 'Here\'s a list of all available commands and their descriptions:',
                FOOTER: 'Requested by {USER_TAG}'
            },
            NO_DESCRIPTION: 'No description available',
            BUTTONS: {
                PREVIOUS: 'Previous',
                NEXT: 'Next',
                BACK_TO_OVERVIEW: 'Back to Overview'
            },
            command_not_found: 'Command not found. Use `/help` to see all available commands.',
            options: 'Command Options'
        },
        setchar: {
            char_not_exist: 'The character {character} does not exist on Warmane.',
            char_already_assigned: 'The character {character} is already assigned to {user}.',
            already_has_main: '{user} already has a main character: {character} ({realm}). If this is a mistake, contact a staff member at our [Discord](https://discord.gg/YDqBQU43Ht).',
            success_with_type: 'Successfully set {character} ({realm}) as {type} character for {user}.',
            success: 'Successfully set {character} ({realm}) as main character for {user}.',
            success_updated: 'Updated main character for {user} from {oldCharacter} to {character} ({realm}).'
        },
        charlist: {
            embed: {
                title: 'Characters for {username}',
                no_characters: 'No characters found for this user.',
                main_character: '**Main Character:**\n{name} - {realm}',
                alt_characters_header: '**Alt Characters:**',
                character_entry: '{name} - {realm}'
            }
        },
        level: {
            no_progress: 'No leveling progress found for this user.',
            level_up: '🎉 Hey {user} you have reached level {level}! Congratulations! 🎉',
            disabled: 'The leveling system is disabled on this server.',
            card_description: 'Level card image'
        },
        setup: {
            title: 'Server Settings',
            description: 'Configure your server settings by clicking the buttons below. Each setting controls different aspects of the bot\'s functionality.',
            no_permission: 'You need to be an administrator or developer to use this command.',
            no_button_permission: 'You need to be an administrator or developer to use these settings.',
            different_user: 'You cannot interact with someone else\'s settings menu. Please use the /settings command to open your own.',
            save_failed: 'Failed to update settings. Please try again.',
            menu_expired: 'Settings menu has expired.',
            footer: 'Settings will automatically save when toggled • Interface times out after 5 minutes',
            features: {
                welcome_message: {
                    name: '👋 Welcome Message',
                    description: 'When enabled, the bot will send a welcome message to new members in the configured welcome channel.'
                },
                char_name_ask: {
                    name: '👤 Character Name Ask',
                    description: 'When enabled, the bot will automatically DM new members asking for their character name and update their nickname accordingly.'
                },
                block_list: {
                    name: '🚫 Block List',
                    description: 'When enabled, the bot uses the global Blacklist to ban members that are on the list.'
                },
                logging: {
                    name: '📝 Logging',
                    description: 'When enabled, the bot will log important events that are executed by the bot in relation to your server.'
                },
                language: {
                    name: '🌍 Language',
                    description: 'Change the language that the bot uses on your server.',
                    current: 'Current language: {language}'
                },
                char_name: {
                    name: '👤 Character Name',
                    description: 'Configure character name settings for your server.'
                },
                status: {
                    enabled: '✅ Enabled',
                    disabled: '❌ Disabled',
                    channel: 'Channel: {channel}'
                },
                leveling: {
                    name: '📊 Leveling System',
                    description: 'Configure the leveling system for your server.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Welcome Message',
                char_name_ask: 'Character Name Ask',
                block_list: 'Block List',
                logging: 'Logging',

                change_language: 'Change Language',
                select_language: 'Select a language',
                edit_charname_dm: 'Edit Character Name DM',
                leveling: 'Leveling System',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Select logging channel',
            select_welcome_channel: 'Select welcome channel',
            select_leveling_channel: 'Select leveling channel',
            log_channel_set: '✅ Logging channel has been set to {channel}',
            not_set: 'Not set',
            language_set: '✅ Server language has been set to {language}',
            leveling_channel_set: '✅ Leveling channel has been set to {channel}',
            welcome_channel_set: '✅ Welcome channel has been set to {channel}',
            charname_dm_modal: {
                title: 'Edit Character Name DM Message',
                message_label: 'DM Message',
                message_placeholder: 'Enter the message to send when asking for character name...'
            },
            charname_dm_updated: '✅ Character name DM message has been updated',
            error_occurred: 'An error occurred: {error}',
        },
        account: {
            embed: {
                description: 'Account information and statistics',
                fields: {
                    account_info_title: '👤 Account Information',
                    username: 'Username',
                    displayName: 'Display Name',
                    id: 'ID',
                    created: 'Created',
                    joined: 'Joined Server',
                    
                    activity_title: '📊 Activity Stats',
                    accountStanding: 'Account Standing',
                    accountLevel: 'Level',
                    accountXP: 'Experience',
                    xpProgress: 'Level Progress',
                    voiceTime: 'Voice Time',
                    serverProgress: 'Server Progress',
                    serverLevel: 'Server Level',
                    serverXP: 'Server XP',
                    
                    roles_title: '🎭 Roles [{count}]',
                    
                    badges_title: '🏅 Badges',
                    
                    tiers: {
                        veteran: '🔱 Artifact',
                        diamond: '💎 Legendary',
                        gold: '🥇 Epic',
                        silver: '🥈 Rare',
                        bronze: '🥉 Common'
                    }
                },
                footer: 'Account Information • {guildName}'
            }
        },
        testcontext: {
            title: 'Context Analysis Test',
            description: 'Testing word: **{word}**',
            test_message: 'Test Message',
            result: 'Result',
            confidence: 'Confidence',
            threshold: 'Threshold',
            context_around_word: 'Context Around Word',
            analysis_reasoning: 'Analysis Reasoning',
            bot_action: 'Bot Action',
            appropriate_usage: 'Appropriate Usage',
            inappropriate_usage: 'Inappropriate Usage',
            would_take_action: 'Would take action (delete/warn)',
            would_allow_message: 'Would allow message',
            and_more: '...and more'
        },


        blacklistword: {
            word_already_exists: 'The word "{word}" is already blacklisted.',
            invalid_pagination_state: 'Invalid pagination state.',
            pagination_error: 'An error occurred while updating the page.',
            word_not_found: 'The word "{word}" is not in the blacklist.',
            no_words: 'There are no blacklisted words for this server.',
            no_global_words: 'There are no global blacklisted words.',
            added_title: '✅ Word Added to Blacklist',
            added_description: 'The word "{word}" has been successfully added to the blacklist.',
            removed_title: '❌ Word Removed from Blacklist',
            removed_description: 'The word "{word}" has been successfully removed from the blacklist.',
            list_title: '📝 Blacklisted Words',
            list_description: 'Here are all blacklisted words for this server ({count} total):',
            global_list_title: '🌐 Global Blacklisted Words',
            global_list_description: 'Here are all global blacklisted words ({count} total):',
            page_info: 'Page {page} of {totalPages}',
            toggle_title: '🔄 Word Status Updated',
            toggle_description: 'The word "{word}" has been {status}.',
            enabled: 'enabled',
            disabled: 'disabled',
            previous_page: 'Previous',
            next_page: 'Next',
            no_reason: 'No reason provided',
            fields: {
                word: 'Word',
                added_by: 'Added By',
                removed_by: 'Removed By',
                toggled_by: 'Toggled By',
                reason: 'Reason',
                case_sensitive: 'Case Sensitive',
                delete_message: 'Delete Message',
                warn_user: 'Warn User',
                context_analysis: 'Context Analysis',
                context_threshold: 'Context Threshold'
            },
            word_info: '**Added by:** {addedBy}\n**Case Sensitive:** {caseSensitive}\n**Delete Message:** {deleteMessage}\n**Warn User:** {warnUser}\n**Context Analysis:** {useContextAnalysis}\n**Context Threshold:** {contextThreshold}\n**Reason:** {reason}'
        }
    },

    events: {
        guildMemberAdd: {
            blacklisted: 'You have been blacklisted from the Guild. If you think this is a mistake, please contact the Guild staff. Or appeal at https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.',
            invalid_response: 'Your response cannot be empty or too long.\nPlease provide a valid response.',
            name_changed: 'Your name has been successfully changed to {nickname} for the Guild {guildName}.',
            name_change_failed: 'Failed to change your name due to: {error}',
            mod_notification: 'Failed to send character name request to {username}. They likely have DMs disabled.',
            welcome_title: 'Welcome to {guildName}!',
            welcome_message: 'Welcome {member} to our server!\n\nIf you have any questions, feel free to ask in a Public channel.',
            log_kicked: 'Kicked {username} due to being blacklisted.',
            log_kick_failed: 'Failed to kick {username} due to: {error}',
            log_dm_failed: 'Failed to send a DM to {username}.',
            log_name_changed: 'Changed {username} to {nickname}.',
            log_name_change_failed: 'Failed to change {username} to {nickname} due to: {error}',
            log_end_message_failed: 'Failed to send end message to {username}: {error}',
            log_interaction_failed: 'Failed to interact with {username}: {error}',
            log_mod_notification_failed: 'Failed to send mod notification: {error}',
            select_character: 'Select one of your characters',
            assigned_chars_found: 'I found some characters assigned to your account. Please select one to use as your nickname:',
            not_on_list_label: 'Not on the list',
            not_on_list_description: 'Enter a different character name manually',
            character_not_found: 'I couldn\'t find that character on any realm. Please check the spelling and try again. Supported realms: Lordaeron, Frostmourne, Icecrown, Blackrock, Frostwolf, Onyxia.',
        },
        blacklisted_word: {
            title: '🚫 Blacklisted Word Detected',
            description: '{username}, your message contained blacklisted word(s): **{words}**\nPlease avoid using these words in the future.',
            fields: {
                channel: 'Channel',
                message_id: 'Message ID',
                context_analysis: 'Context Analysis'
            }
        },
        guildCreate: {
            thanks_title: 'Thanks for adding me to {guildName}! 🎉',
            description: 'Here\'s how to get started with setting up the bot:',
            basic_commands: '📚 Basic Commands',
            help_command: '`/help` - View all available commands',
            essential_setup: '⚙️ Essential Setup',
            setup_command: '`/setup` - Configure all bot features:',
            setup_features: [
                '• Welcome Messages & Channel',
                '• Character Name System',
                '• Block List Protection',
                '• Server Logging',
                '• Bot Language',
                '• Custom DM Messages'
            ],
            character_management: '👤 Character Management',
            char_commands: [
                '`/set-char` - Assign a character to a user',
                '`/charname` - Ask a user for their character name',
                'U can also right click on a user and select "Ask for Charname" to ask for a character name'
            ],
            need_help: '🔗 Need Help?',
            support_server: '[Join our Support Server](https://discord.gg/YDqBQU43Ht)',
            footer: 'Have fun using the bot! 🤖'
        }
    },
    level: {
        level_up: '{user} has reached level {level}!'
    },
    logging: {
        error: 'Error',
        footer: 'Server Logs',
        log_event: 'Log Event',
        information: 'Information',
        no_value_provided: 'No value provided',
        missing_permissions_notification: 'I don\'t have the required permissions to send logs in the configured log channel. Please ensure I have the following permissions: View Channel, Send Messages, and Embed Links.',
        server_information: 'Server Information',
        development_logs: 'Development Logs',
        
        // Direct translations for field keys
        dm: {
            user_label: 'User',
            user_id: 'User ID',
            error_label: 'Error',
            error: 'Error'
        },
        
        // Member events
        member_banned: {
            title: 'Member Banned',
            description: 'Banned blacklisted user',
            reason_label: 'Reason'
        },
        nickname_changed: {
            title: 'Nickname Changed',
            description: 'Changed nickname for {username} to {nickname}',
            new_nickname: 'New Nickname'
        },
        
        // DM related logs
        dm_sent: {
            title: 'DM Sent',
            description: 'Sent character name request DM to {username}'
        },
        dm_failed: {
            title: 'DM Failed',
            description: 'Failed to send DM to {username}',
            user_label: 'User',
            user_id: 'User ID',
            error_label: 'Error',
            response: 'Response',
            reason_label: 'Reason'
        },
        dm_timeout: {
            title: 'DM Response Timeout',
            description: '{username} did not respond within the time limit'
        },
        
        // System events
        invite_created: {
            title: 'Invite Created',
            description: 'Created new server invite for {botName} Developers',
            channel: 'Channel',
            created_by: 'Created By'
        },
        interaction_failed: {
            title: 'Interaction Failed',
            description: 'Failed to interact with {username}',
            error_label: 'Error',
            component_label: 'Component'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Leveling Progress Removed',
            description: 'Leveling progress removed for {username}, {userId}>'
        },
        level_up: {
            title: 'Level Up',
            description: '{username} has reached level {level}',
            previous_level: 'Previous Level',
            current_level: 'Current Level',
            xp_earned: 'XP Earned'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Permission Denied',
            description: '{username} attempted to use {command} without proper permissions',
            required_permissions: 'Required Permissions',
            user_permissions: 'User Permissions'
        },
        
        // Command usage logs
        command_used: {
            title: 'Command Used',
            description: '{username} used {command}',
            channel: 'Channel',
            options: 'Options'
        },
        
        // Blacklisted word logs
        blacklisted_word_added: {
            title: 'Blacklisted Word Added',
            description: 'Added "{word}" to blacklist',
            fields: {
                added_by: 'Added By',
                channel: 'Channel',
                reason: 'Reason'
            }
        },
        blacklisted_word_removed: {
            title: 'Blacklisted Word Removed',
            description: 'Removed "{word}" from blacklist',
            fields: {
                removed_by: 'Removed By',
                channel: 'Channel'
            }
        },
        blacklisted_word_toggled: {
            title: 'Blacklisted Word Toggled',
            description: 'Toggled "{word}" {status}',
            enabled: 'enabled',
            disabled: 'disabled',
            fields: {
                toggled_by: 'Toggled By',
                channel: 'Channel'
            }
        },
        blacklisted_word_used: {
            title: 'Blacklisted Word Used',
            description: '{username} used blacklisted word(s): {words}',
            fields: {
                user: 'User',
                channel: 'Channel',
                message_id: 'Message ID',
                action_taken: 'Action Taken',
                message_content: 'Message Content'
            },
            no_action: 'No action taken'
        }
    }
};