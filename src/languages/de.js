module.exports = {
    commands: {
        global_strings: {
            no_permission: 'Du hast nicht die erforderlichen Berechtigungen für diesen Befehl.',
            invalid_target: 'Ungültiges Ziel!',
            dm_failed: 'Konnte keine DM an {username} senden.',
            dm_sent: 'DM an {username} gesendet.',
            guild_only: 'Dieser Befehl kann nur in einem Server verwendet werden.',
            not_in_guild: 'Dieser Befehl kann nur in einem Server verwendet werden.',
            error_occurred: 'Ein Fehler ist aufgetreten: {error}',
            user_not_found: 'Benutzer nicht gefunden.',
            bot_developer_only: 'Dieser Befehl ist nur für Bot-Entwickler verfügbar.'
        },
        charname: {
            dm_initial: 'Hey, ich würde gerne nach deinem Hauptcharakter-Namen fragen.\nBitte antworte mit deinem Hauptcharakter-Namen für den Server.\n\nDu hast 10 Minuten Zeit zum Antworten.',
            empty_response: 'Deine Antwort darf nicht leer sein. Bitte gib eine gültige Antwort.',
            nickname_success: 'Dein Hauptcharakter-Name wurde erfolgreich zu {nickname} geändert.',
            nickname_failed: 'Fehler beim Ändern deines Hauptcharakter-Namens: {error}',
            dm_timeout_message: 'Zeit abgelaufen. Bitte kontaktiere einen Mitarbeiter von {guildName} für eine neue Chance.'
        },
        globalcheck: {
            no_blacklisted: 'Es gibt keine Benutzer auf der schwarzen Liste.',
            no_blacklisted_guild: 'Es gibt keine Benutzer auf der schwarzen Liste in diesem Server.',
            not_for_you: 'Diese Schaltflächen sind nicht für dich!',
            embed_title: 'Benutzer auf der schwarzen Liste',
            blacklisted_user: 'ID: <@{userId}>\nGrund: {reason}',
            BUTTONS: {
                KICK: 'Kicken',
                BAN: 'Bannen',
                NOTHING: 'Nichts tun'
            },
            ACTION_RESULTS: {
                KICKED: '{COUNT} Mitglieder erfolgreich gekickt',
                BANNED: '{COUNT} Mitglieder erfolgreich gebannt',
                NOTHING: 'Keine Aktion durchgeführt',
                FAILED: 'Konnte {COUNT} Mitglieder nicht verarbeiten'
            },
            navigation: {
                previous: 'Zurück',
                next: 'Weiter'
            }
        },
        report: {
            modal: {
                title: 'Benutzer melden',
                username_label: 'Benutzername des gemeldeten Benutzers?',
                username_placeholder: 'Gib den Benutzernamen/Discord-ID hier ein!',
                reason_label: 'Grund',
                reason_placeholder: 'Gib den Grund hier ein!',
                evidence_label: 'Stelle deine Beweise bereit.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            },
            submitted: 'Dein Bericht wurde eingereicht. Vielen Dank, dass du uns hilfst, den Server sicher zu halten.',
            report_title: 'Benutzerbericht',
            reported_user: 'Gemeldeter Benutzer',
            reason: 'Grund',
            evidence: 'Beweise',
            reporter_id: 'Reporter-ID',
            submitted_by: 'Bericht eingereicht von {user}',
            send_failed: 'Fehler beim Senden des Berichts an den Moderationskanal.'
        },
        poll: {
            question_missing: 'Umfragefrage fehlt.',
            answer_too_long: 'Eine der Antworten überschreitet das Limit von 55 Zeichen: "{answer}"',
            min_answers: 'Mindestens zwei Antworten sind erforderlich.',
            creation_failed: 'Fehler beim Senden einer Umfrage an den Kanal: {error}',
            created_pinned: 'Deine Umfrage wurde erstellt und angepinnt!',
            created: 'Deine Umfrage wurde erstellt!'
        },
        charinfo: {
            loading: 'Wir suchen nach deinen Daten. Bitte hab Geduld.',
            char_not_exist: 'Der Charakter {character} existiert nicht.',
            embed: {
                title: 'Charakter Information',
                description: 'Informationen über {character} - [Rüstkammer]({url})',
                fields: {
                    character: 'Charakter',
                    realm: 'Reich',
                    online: 'Online',
                    level: 'Stufe',
                    yes: 'Ja',
                    no: 'Nein',
                    gender: 'Geschlecht',
                    race: 'Volk',
                    class: 'Klasse',
                    faction: 'Fraktion',
                    honorable_kills: 'Ehrenhafte Siege',
                    guild: 'Gilde',
                    achievement_points: 'Erfolgspunkte',
                    talents: 'Talente',
                    no_guild: 'Keine',
                    pvp_teams: 'PvP Teams',
                    gearscore: 'Ausrüstungswertung',
                    missing_gems: 'Fehlende Edelsteine',
                    missing_enchants: 'Fehlende Verzauberungen',
                    none: 'Keine',
                    professions: 'Berufe',
                    teams: 'PvP Teams ({type}): {name} (Wertung: {rating}, Rang: {rank})',
                    belongs_to: 'Gehört zu'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'Die Willkommens-DM ist nicht aktiviert.',
            updated: 'Die Willkommensnachricht wurde aktualisiert.'
        },
        servertime: {
            embed: {
                title: 'Serverzeit',
                description: 'Die aktuelle Serverzeit ist: {time}',
                footer: 'Angefordert von: {user}'
            },
            error: 'Ein Fehler ist beim Abrufen der Serverzeit aufgetreten.'
        },
        setwelcomechannel: {
            channel_set: 'Der Willkommenskanal wurde auf {channel} gesetzt.',
            error: 'Fehler beim Setzen des Willkommenskanals: {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Verfügbare Befehle',
                DESCRIPTION: 'Hier ist eine Liste aller verfügbaren Befehle und ihrer Beschreibungen:',
                FOOTER: 'Angefordert von {USER_TAG}'
            },
            NO_DESCRIPTION: 'Keine Beschreibung verfügbar',
            BUTTONS: {
                PREVIOUS: 'Zurück',
                NEXT: 'Weiter',
                BACK_TO_OVERVIEW: 'Zurück zur Übersicht'
            },
            command_not_found: 'Befehl nicht gefunden. Verwende `/help`, um alle verfügbaren Befehle zu sehen.',
            options: 'Befehlsoptionen'
        },
        setchar: {
            char_not_exist: 'Der Charakter {character} existiert nicht auf Warmane.',
            char_already_assigned: 'Der Charakter {character} ist bereits {user} zugewiesen.',
            already_has_main: '{user} hat bereits einen Hauptcharakter: {character} ({realm}). Falls dies ein Fehler ist, kontaktiere einen Mitarbeiter in unserem [Discord](https://discord.gg/YDqBQU43Ht).',
            success_with_type: '{character} ({realm}) wurde erfolgreich als {type} Charakter für {user} gesetzt.',
            success: '{character} ({realm}) wurde erfolgreich als Hauptcharakter für {user} gesetzt.',
            success_updated: 'Hauptcharakter für {user} von {oldCharacter} zu {character} ({realm}) aktualisiert.'
        },
        charlist: {
            embed: {
                title: 'Charaktere von {username}',
                no_characters: 'Keine Charaktere für diesen Benutzer gefunden.',
                main_character: '**Hauptcharakter:**\n{name} - {realm}',
                alt_characters_header: '**Twink-Charaktere:**',
                character_entry: '{name} - {realm}'
            }
        },
        level: {
            no_progress: 'Du hast noch keinen Level erreicht.',
            level_up: '🎉 Hey {user} du hast Level {level} erreicht! Gratulation! 🎉',
            disabled: 'Das Leveling-System ist auf diesem Server deaktiviert.',
            card_description: 'Level-Kartenbild'
        },
        setup: {
            title: 'Server Einstellungen',
            description: 'Konfiguriere deine Server-Einstellungen durch Klicken der Schaltflächen unten. Jede Einstellung steuert verschiedene Aspekte der Bot-Funktionalität.',
            no_permission: 'Du musst Administrator oder Entwickler sein, um diesen Befehl zu verwenden.',
            no_button_permission: 'Du musst Administrator oder Entwickler sein, um diese Einstellungen zu verwenden.',
            different_user: 'Du kannst nicht mit den Einstellungen eines anderen interagieren. Bitte verwende den /settings Befehl, um deine eigenen zu öffnen.',
            save_failed: 'Fehler beim Aktualisieren der Einstellungen. Bitte versuche es erneut.',
            menu_expired: 'Einstellungsmenü ist abgelaufen.',
            footer: 'Einstellungen werden automatisch beim Umschalten gespeichert • Interface läuft nach 5 Minuten ab',
            features: {
                welcome_message: {
                    name: '👋 Willkommensnachricht',
                    description: 'Wenn aktiviert, sendet der Bot eine Willkommensnachricht an neue Mitglieder im konfigurierten Willkommenskanal.'
                },
                char_name_ask: {
                    name: '👤 Charaktername Abfrage',
                    description: 'Wenn aktiviert, fragt der Bot neue Mitglieder automatisch nach ihrem Charakternamen und aktualisiert ihren Nicknamen entsprechend.'
                },
                block_list: {
                    name: '🚫 Sperrliste',
                    description: 'Wenn aktiviert, verwendet der Bot die globale Blacklist, um Mitglieder zu sperren, die auf der Liste stehen.'
                },
                logging: {
                    name: '📝 Protokollierung',
                    description: 'Wenn aktiviert, protokolliert der Bot wichtige Ereignisse, die vom Bot in Bezug auf deinen Server ausgeführt werden.'
                },
                language: {
                    name: '🌍 Sprache',
                    description: 'Ändere die Sprache, die der Bot auf deinem Server verwendet.',
                    current: 'Aktuelle Sprache: {language}'
                },
                char_name: {
                    name: '👤 Charaktername',
                    description: 'Konfiguriere die Einstellungen für Charakternamen auf deinem Server.'
                },
                status: {
                    enabled: '✅ Aktiviert',
                    disabled: '❌ Deaktiviert',
                    channel: 'Kanal: {channel}'
                },
                leveling: {
                    name: '📊 Leveling System',
                    description: 'Konfiguriere das Leveling-System für deinen Server.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Willkommensnachricht',
                char_name_ask: 'Charaktername Abfrage',
                block_list: 'Sperrliste',
                logging: 'Protokollierung',
                change_language: 'Sprache ändern',
                select_language: 'Sprache auswählen',
                edit_charname_dm: 'Charakternamen DM bearbeiten',
                leveling: 'Leveling System',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Protokollkanal auswählen',
            select_welcome_channel: 'Willkommenskanal auswählen',
            select_leveling_channel: 'Leveling-Kanal auswählen',
            log_channel_set: '✅ Protokollkanal wurde auf {channel} gesetzt',
            not_set: 'Nicht gesetzt',
            language_set: '✅ Server-Sprache wurde auf {language} gesetzt',
            leveling_channel_set: '✅ Leveling-Kanal wurde auf {channel} gesetzt',
            welcome_channel_set: '✅ Willkommenskanal wurde auf {channel} gesetzt',
            charname_dm_modal: {
                title: 'Charakternamen DM-Nachricht bearbeiten',
                message_label: 'DM-Nachricht',
                message_placeholder: 'Gib die Nachricht ein, die beim Fragen nach dem Charakternamen gesendet werden soll...'
            },
            charname_dm_updated: '✅ Charakternamen DM-Nachricht wurde aktualisiert',
            error_occurred: 'Ein Fehler ist aufgetreten: {error}'
        },
        account: {
            embed: {
                description: 'Kontoinformationen und Statistiken',
                fields: {
                    account_info_title: '👤 Kontoinformationen',
                    username: 'Benutzername',
                    displayName: 'Anzeigename',
                    id: 'ID',
                    created: 'Erstellt',
                    joined: 'Server beigetreten',
                    
                    activity_title: '📊 Aktivitätsstatistiken',
                    accountStanding: 'Kontostatus',
                    accountLevel: 'Level',
                    accountXP: 'Erfahrung',
                    xpProgress: 'Level-Fortschritt',
                    voiceTime: 'Sprachzeit',
                    serverProgress: 'Server-Fortschritt',
                    serverLevel: 'Server-Level',
                    serverXP: 'Server-XP',
                    
                    roles_title: '🎭 Rollen [{count}]',
                    
                    badges_title: '🏅 Abzeichen',
                    
                    tiers: {
                        veteran: '🔱 Artefakt',
                        diamond: '💎 Legendär',
                        gold: '🥇 Episch',
                        silver: '🥈 Selten',
                        bronze: '🥉 Gewöhnlich'
                    }
                },
                footer: 'Kontoinformationen • {guildName}'
            }
        },
        testcontext: {
            title: 'Kontextanalyse-Test',
            description: 'Testwort: **{word}**',
            test_message: 'Testnachricht',
            result: 'Ergebnis',
            confidence: 'Vertrauen',
            threshold: 'Schwellenwert',
            context_around_word: 'Kontext um das Wort',
            analysis_reasoning: 'Analyse-Begründung',
            bot_action: 'Bot-Aktion',
            appropriate_usage: 'Angemessene Verwendung',
            inappropriate_usage: 'Unangemessene Verwendung',
            would_take_action: 'Würde Aktion ergreifen (löschen/warnen)',
            would_allow_message: 'Würde Nachricht erlauben',
            and_more: '...und mehr'
        },
        blacklistword: {
            word_already_exists: 'Das Wort "{word}" ist bereits auf der schwarzen Liste.',
            invalid_pagination_state: 'Ungültiger Paginierungszustand.',
            pagination_error: 'Ein Fehler ist beim Aktualisieren der Seite aufgetreten.',
            word_not_found: 'Das Wort "{word}" ist nicht auf der schwarzen Liste.',
            no_words: 'Es gibt keine Wörter auf der schwarzen Liste für diesen Server.',
            no_global_words: 'Es gibt keine globalen Wörter auf der schwarzen Liste.',
            added_title: '✅ Wort zur schwarzen Liste hinzugefügt',
            added_description: 'Das Wort "{word}" wurde erfolgreich zur schwarzen Liste hinzugefügt.',
            removed_title: '❌ Wort von der schwarzen Liste entfernt',
            removed_description: 'Das Wort "{word}" wurde erfolgreich von der schwarzen Liste entfernt.',
            list_title: '📝 Wörter auf der schwarzen Liste',
            list_description: 'Hier sind alle Wörter auf der schwarzen Liste für diesen Server ({count} insgesamt):',
            global_list_title: '🌐 Globale Wörter auf der schwarzen Liste',
            global_list_description: 'Hier sind alle globalen Wörter auf der schwarzen Liste ({count} insgesamt):',
            page_info: 'Seite {page} von {totalPages}',
            toggle_title: '🔄 Wortstatus aktualisiert',
            toggle_description: 'Das Wort "{word}" wurde {status}.',
            enabled: 'aktiviert',
            disabled: 'deaktiviert',
            previous_page: 'Zurück',
            next_page: 'Weiter',
            no_reason: 'Kein Grund angegeben',
            fields: {
                word: 'Wort',
                added_by: 'Hinzugefügt von',
                removed_by: 'Entfernt von',
                toggled_by: 'Umschalten von',
                reason: 'Grund',
                case_sensitive: 'Groß-/Kleinschreibung',
                delete_message: 'Nachricht löschen',
                warn_user: 'Benutzer warnen',
                context_analysis: 'Kontextanalyse',
                context_threshold: 'Kontext-Schwellenwert'
            },
            word_info: '**Hinzugefügt von:** {addedBy}\n**Groß-/Kleinschreibung:** {caseSensitive}\n**Nachricht löschen:** {deleteMessage}\n**Benutzer warnen:** {warnUser}\n**Kontextanalyse:** {useContextAnalysis}\n**Kontext-Schwellenwert:** {contextThreshold}\n**Grund:** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Du wurdest von der Gilde auf die schwarze Liste gesetzt. Wenn du denkst, dass dies ein Fehler ist, kontaktiere bitte die Gildenleitung oder melde dich unter https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Hey, ich würde gerne nach deinem Hauptcharakter-Namen fragen.\nBitte antworte mit deinem Hauptcharakter-Namen für den Server.',
            invalid_response: 'Deine Antwort darf nicht leer oder zu lang sein.\nBitte gib eine gültige Antwort.',
            name_changed: 'Dein Name wurde erfolgreich zu {nickname} für die Gilde {guildName} geändert.',
            name_change_failed: 'Fehler beim Ändern deines Namens: {error}',
            mod_notification: 'Konnte keine Charakternamenanfrage an {username} senden. Wahrscheinlich sind DMs deaktiviert.',
            welcome_title: 'Willkommen bei {guildName}!',
            welcome_message: 'Willkommen {member} auf unserem Server!\n\nWenn du Fragen hast, kannst du sie gerne in einem öffentlichen Kanal stellen.',
            log_kicked: 'Gekickt {username} aufgrund der schwarzen Liste.',
            log_kick_failed: 'Konnte {username} nicht kicken: {error}',
            log_dm_failed: 'Konnte keine DM an {username} senden.',
            log_name_changed: 'Name von {username} zu {nickname} geändert.',
            log_name_change_failed: 'Konnte den Namen von {username} nicht zu {nickname} ändern: {error}',
            log_end_message_failed: 'Konnte keine Abschlussnachricht an {username} senden: {error}',
            log_interaction_failed: 'Konnte nicht mit {username} interagieren: {error}',
            log_mod_notification_failed: 'Konnte keine Mod-Benachrichtigung senden: {error}',
            select_character: 'Wähle einen deiner Charaktere',
            assigned_chars_found: 'Ich habe einige Charaktere gefunden, die deinem Account zugeordnet sind. Bitte wähle einen als deinen Nicknamen aus:',
            not_on_list_label: 'Nicht in der Liste',
            not_on_list_description: 'Einen anderen Charakternamen manuell eingeben',
            character_not_found: 'Ich konnte diesen Charakter nicht finden. Bitte versuche es mit einem gültigen Charakternamen erneut.'
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
            thanks_title: 'Danke, dass du mich zu {guildName} hinzugefügt hast! 🎉',
            description: 'So kannst du mit der Einrichtung des Bots beginnen:',
            basic_commands: '📚 Grundlegende Befehle',
            help_command: '`/help` - Alle verfügbaren Befehle anzeigen',
            essential_setup: '⚙️ Wichtige Einrichtung',
            setup_command: '`/setup` - Alle Bot-Funktionen konfigurieren:',
            setup_features: [
                '• Willkommensnachrichten & Kanal',
                '• Charakternamen-System',
                '• Sperrlisten-Schutz',
                '• Server-Protokollierung',
                '• Bot-Sprache',
                '• Benutzerdefinierte DM-Nachrichten'
            ],
            character_management: '👤 Charakterverwaltung',
            char_commands: [
                '`/set-char` - Einen Charakter einem Benutzer zuweisen',
                '`/charname` - Einen Benutzer nach seinem Charakternamen fragen',
                'Du kannst auch mit der rechten Maustaste auf einen Benutzer klicken und "Nach Charname fragen" auswählen'
            ],
            need_help: '🔗 Brauchst du Hilfe?',
            support_server: '[Tritt unserem Support-Server bei](https://discord.gg/YDqBQU43Ht)',
            footer: 'Viel Spaß beim Verwenden des Bots! 🤖'
        }
    },
    logging: {
        error: 'Fehler',
        footer: 'Server-Logs',
        log_event: 'Log-Ereignis',
        information: 'Information',
        no_value_provided: 'Kein Wert angegeben',
        missing_permissions_notification: 'Ich habe nicht die erforderlichen Berechtigungen, um Logs im konfigurierten Log-Kanal zu senden. Bitte stelle sicher, dass ich die folgenden Berechtigungen habe: Kanal anzeigen, Nachrichten senden und Einbettungen verknüpfen.',
        server_information: 'Server-Information',
        development_logs: 'Entwicklungs-Logs',
        
        // Direct translations for field keys
        dm: {
            user_label: 'Benutzer',
            user_id: 'Benutzer ID',
            error_label: 'Fehler',
            error: 'Fehler'
        },
        
        // Member events
        member_banned: {
            title: 'Mitglied Gebannt',
            description: 'Blacklist-Benutzer gebannt',
            reason_label: 'Grund'
        },
        nickname_changed: {
            title: 'Nickname Geändert',
            description: 'Nickname für {username} zu {nickname} geändert',
            new_nickname: 'Neuer Nickname'
        },
        
        // DM related logs
        dm_sent: {
            title: 'DM Gesendet',
            description: 'Charakternamen-Anfrage DM an {username} gesendet'
        },
        dm_failed: {
            title: 'DM Fehlgeschlagen',
            description: 'Konnte keine DM an {username} senden',
            user_label: 'Benutzer',
            user_id: 'Benutzer ID',
            error_label: 'Fehler',
            response: 'Antwort',
            reason_label: 'Grund'
        },
        dm_timeout: {
            title: 'DM Antwort Zeitüberschreitung',
            description: '{username} hat nicht innerhalb der Zeitbegrenzung geantwortet'
        },
        
        // System events
        invite_created: {
            title: 'Einladung Erstellt',
            description: 'Neue Server-Einladung für {botName} Entwickler erstellt',
            channel: 'Kanal',
            created_by: 'Erstellt von'
        },
        interaction_failed: {
            title: 'Interaktion Fehlgeschlagen',
            description: 'Fehlgeschlagen, um mit {username} zu interagieren',
            error_label: 'Fehler',
            component_label: 'Komponente'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Leveling-Fortschritt Entfernt',
            description: 'Leveling-Fortschritt entfernt für {username}, {userId}>'
        },
        level_up: {
            title: 'Level Aufgestiegen',
            description: '{username} hat Level {level} erreicht',
            previous_level: 'Vorheriges Level',
            current_level: 'Aktuelles Level',
            xp_earned: 'XP Erhalten'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Berechtigung Verweigert',
            description: '{username} hat versucht, {command} ohne die erforderlichen Berechtigungen zu verwenden',
            required_permissions: 'Erforderliche Berechtigungen',
            user_permissions: 'Benutzer-Berechtigungen'
        },
        
        // Command usage logs
        command_used: {
            title: 'Befehl Verwendet',
            description: '{username} hat {command} verwendet',
            channel: 'Kanal',
            options: 'Optionen'
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