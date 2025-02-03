module.exports = {
    commands: {
        global_strings: {
            no_permission: "Du hast nicht die erforderlichen Berechtigungen für diesen Befehl.",
            invalid_target: "Ungültiges Ziel!",
            dm_failed: "Konnte keine DM an {username} senden.",
            dm_sent: "DM an {username} gesendet.",
            guild_only: "Dieser Befehl kann nur in einem Server verwendet werden.",
            error_occurred: "Ein Fehler ist aufgetreten: {error}"
        },
        charname: {
            dm_initial: "Hey, ich würde gerne nach deinem Hauptcharakter-Namen fragen.\nBitte antworte mit deinem Hauptcharakter-Namen für den Server.\n\nDu hast 10 Minuten Zeit zum Antworten.",
            empty_response: "Deine Antwort darf nicht leer sein. Bitte gib eine gültige Antwort.",
            nickname_success: "Dein Hauptcharakter-Name wurde erfolgreich zu {nickname} geändert.",
            nickname_failed: "Fehler beim Ändern deines Hauptcharakter-Namens: {error}",
            dm_timeout_message: "Zeit abgelaufen. Bitte kontaktiere einen Mitarbeiter von {guildName} für eine neue Chance."
        },
        globalcheck: {
            no_blacklisted: "Es gibt keine Benutzer auf der schwarzen Liste.",
            no_blacklisted_guild: "Es gibt keine Benutzer auf der schwarzen Liste in diesem Server.",
            not_for_you: "Diese Schaltflächen sind nicht für dich!",
            embed_title: "Benutzer auf der schwarzen Liste",
            blacklisted_user: "ID: <@{userId}>\nGrund: {reason}",
            BUTTONS: {
                KICK: "Kicken",
                BAN: "Bannen",
                NOTHING: "Nichts tun"
            },
            ACTION_RESULTS: {
                KICKED: "{COUNT} Mitglieder erfolgreich gekickt",
                BANNED: "{COUNT} Mitglieder erfolgreich gebannt",
                NOTHING: "Keine Aktion durchgeführt",
                FAILED: "Konnte {COUNT} Mitglieder nicht verarbeiten"
            }
        },
        report: {
            modal: {
                title: "Benutzer melden",
                username_label: "Benutzername des gemeldeten Benutzers?",
                username_placeholder: "Gib den Benutzernamen/Discord-ID hier ein!",
                reason_label: "Grund",
                reason_placeholder: "Gib den Grund hier ein!",
                evidence_label: "Stelle deine Beweise bereit.",
                evidence_placeholder: "https://imgur.com/blablabla!"
            }
        },
        poll: {
            question_missing: "Umfragefrage fehlt.",
            answer_too_long: "Eine der Antworten überschreitet das Limit von 55 Zeichen: \"{answer}\"",
            min_answers: "Mindestens zwei Antworten sind erforderlich.",
            creation_failed: "Fehler beim Erstellen der Umfrage: {error}",
            created_pinned: "Deine Umfrage wurde erstellt und angepinnt!",
            created: "Deine Umfrage wurde erstellt!"
        },
        charinfo: {
            loading: "Wir suchen nach deinen Daten. Bitte hab Geduld.",
            char_not_exist: "Der Charakter {character} existiert nicht.",
            embed: {
                title: "Charakter Information",
                description: "Informationen über {character} - [Rüstkammer]({url})",
                fields: {
                    character: "Charakter",
                    realm: "Reich",
                    online: "Online",
                    level: "Stufe",
                    yes: "Ja",
                    no: "Nein",
                    gender: "Geschlecht",
                    race: "Volk",
                    class: "Klasse",
                    faction: "Fraktion",
                    honorable_kills: "Ehrenhafte Siege",
                    guild: "Gilde",
                    achievement_points: "Erfolgspunkte",
                    talents: "Talente",
                    no_guild: "Keine",
                    pvp_teams: "PvP Teams",
                    gearscore: "Ausrüstungswertung",
                    missing_gems: "Fehlende Edelsteine",
                    missing_enchants: "Fehlende Verzauberungen",
                    none: "Keine",
                    professions: "Berufe",
                    teams: "PvP Teams ({type}): {name} (Wertung: {rating}, Rang: {rank})",
                    belongs_to: "Gehört zu"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "Die Willkommens-DM ist nicht aktiviert.",
            updated: "Die Willkommensnachricht wurde aktualisiert."
        },
        servertime: {
            embed: {
                title: "Serverzeit",
                description: "Die aktuelle Serverzeit ist: {time}",
                footer: "Angefordert von: {user}"
            }
        },
        setwelcomechannel: {
            channel_set: "Der Willkommenskanal wurde auf {channel} gesetzt.",
            error: "Fehler beim Setzen des Willkommenskanals: {error}"
        },
        help: {
            EMBED: {
                TITLE: "Verfügbare Befehle",
                DESCRIPTION: "Hier ist eine Liste aller verfügbaren Befehle und ihrer Beschreibungen:",
                FOOTER: "Angefordert von {USER_TAG}"
            },
            NO_DESCRIPTION: "Keine Beschreibung verfügbar",
            BUTTONS: {
                PREVIOUS: "Zurück",
                NEXT: "Weiter"
            }
        },
        setchar: {
            char_not_exist: "Der Charakter {character} existiert nicht auf Warmane.",
            char_already_assigned: "Der Charakter {character} ist bereits {user} zugewiesen.",
            already_has_main: "{user} hat bereits einen Hauptcharakter: {character} ({realm}). Falls dies ein Fehler ist, kontaktiere einen Mitarbeiter in unserem [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "{character} ({realm}) wurde erfolgreich als {type} Charakter für {user} gesetzt.",
            success: "{character} ({realm}) wurde erfolgreich als Hauptcharakter für {user} gesetzt.",
            success_updated: "Hauptcharakter für {user} von {oldCharacter} zu {character} ({realm}) aktualisiert."
        },
        charlist: {
            embed: {
                title: "Charaktere von {username}",
                no_characters: "Keine Charaktere für diesen Benutzer gefunden.",
                main_character: "**Hauptcharakter:**\n{name} - {realm}",
                alt_characters_header: "**Twink-Charaktere:**",
                character_entry: "{name} - {realm}"
            }
        },
        level: {
            no_progress: "Du hast noch keinen Level erreicht.",
            level_up: "🎉 Hey {user} du hast Level {level} erreicht! Gratulation! 🎉"
        },

        setup: {
            title: "Server Einstellungen",
            description: "Konfiguriere deine Server-Einstellungen durch Klicken der Schaltflächen unten. Jede Einstellung steuert verschiedene Aspekte der Bot-Funktionalität.",
            no_permission: "Du musst Administrator oder Entwickler sein, um diesen Befehl zu verwenden.",
            no_button_permission: "Du musst Administrator oder Entwickler sein, um diese Einstellungen zu verwenden.",
            different_user: "Du kannst nicht mit den Einstellungen eines anderen interagieren. Bitte verwende den /settings Befehl, um deine eigenen zu öffnen.",
            save_failed: "Fehler beim Aktualisieren der Einstellungen. Bitte versuche es erneut.",
            menu_expired: "Einstellungsmenü ist abgelaufen.",
            footer: "Einstellungen werden automatisch beim Umschalten gespeichert • Interface läuft nach 5 Minuten ab",
            features: {
                welcome_message: {
                    name: "👋 Willkommensnachricht",
                    description: "Wenn aktiviert, sendet der Bot eine Willkommensnachricht an neue Mitglieder im konfigurierten Willkommenskanal."
                },
                char_name_ask: {
                    name: "👤 Charaktername Abfrage",
                    description: "Wenn aktiviert, fragt der Bot neue Mitglieder automatisch nach ihrem Charakternamen und aktualisiert ihren Nicknamen entsprechend."
                },
                block_list: {
                    name: "🚫 Sperrliste",
                    description: "Wenn aktiviert, verwendet der Bot die globale Blacklist, um Mitglieder zu sperren, die auf der Liste stehen."
                },
                logging: {
                    name: "📝 Protokollierung",
                    description: "Wenn aktiviert, protokolliert der Bot wichtige Ereignisse, die vom Bot in Bezug auf deinen Server ausgeführt werden."
                },
                status: {
                    enabled: "✅ Aktiviert",
                    disabled: "❌ Deaktiviert",
                    channel: "Kanal: {channel}"
                },
                char_name: {
                    name: "👤 Charaktername",
                    description: "Konfiguriere die Einstellungen für Charakternamen auf deinem Server."
                },
                language: {
                    name: "🌍 Sprache",
                    description: "Ändere die Sprache, die der Bot auf deinem Server verwendet.",
                    current: "Aktuelle Sprache: {language}"
                },
                leveling: {
                    name: "📊 Leveling System",
                    description: "Konfiguriere das Leveling-System für deinen Server."
                }
            },

            buttons: {
                welcome_message: "Willkommensnachricht",
                char_name_ask: "Charaktername Abfrage",
                block_list: "Sperrliste",
                logging: "Protokollierung",
                change_language: "Sprache ändern",
                select_language: "Sprache auswählen",
                edit_charname_dm: "Charakternamen DM bearbeiten"
            },
            select_log_channel: "Protokollkanal auswählen",
            select_welcome_channel: "Willkommenskanal auswählen",
            select_leveling_channel: "Leveling-Kanal auswählen",
            log_channel_set: "✅ Protokollkanal wurde auf {channel} gesetzt",
            not_set: "Nicht eingestellt",
            language_set: "✅ Serversprache wurde auf {language} eingestellt",
            leveling_channel_set: "✅ Leveling-Kanal wurde auf {channel} gesetzt",
            welcome_channel_set: "✅ Willkommenskanal wurde auf {channel} gesetzt",
            charname_dm_modal: {
                title: "Charakternamen DM-Nachricht bearbeiten",
                message_label: "DM-Nachricht",
                message_placeholder: "Gib die Nachricht ein, die beim Fragen nach dem Charakternamen gesendet werden soll..."
            },
            charname_dm_updated: "✅ Charakternamen DM-Nachricht wurde aktualisiert",
            error_occurred: "Ein Fehler ist aufgetreten: {error}"
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Du wurdest von der Gilde auf die schwarze Liste gesetzt. Wenn du denkst, dass dies ein Fehler ist, kontaktiere bitte die Gildenleitung oder melde dich unter https://discord.gg/YDqBQU43Ht",
            invalid_response: "Deine Antwort darf nicht leer oder zu lang sein.\nBitte gib eine gültige Antwort.",
            name_changed: "Dein Name wurde erfolgreich zu {nickname} für die Gilde {guildName} geändert.",
            name_change_failed: "Fehler beim Ändern deines Namens: {error}",
            mod_notification: "Konnte keine Charakternamenanfrage an {username} senden. Wahrscheinlich sind DMs deaktiviert.",
            welcome_title: "Willkommen bei {guildName}!",
            welcome_message: "Willkommen {member} auf unserem Server!\n\nWenn du Fragen hast, kannst du sie gerne in einem öffentlichen Kanal stellen.",
            log_kicked: "Gekickt {username} aufgrund der schwarzen Liste.",
            log_kick_failed: "Konnte {username} nicht kicken: {error}",
            log_dm_failed: "Konnte keine DM an {username} senden.",
            log_name_changed: "Name von {username} zu {nickname} geändert.",
            log_name_change_failed: "Konnte den Namen von {username} nicht zu {nickname} ändern: {error}",
            log_end_message_failed: "Konnte keine Abschlussnachricht an {username} senden: {error}",
            log_interaction_failed: "Konnte nicht mit {username} interagieren: {error}",
            log_mod_notification_failed: "Konnte keine Mod-Benachrichtigung senden: {error}",
            select_character: "Wähle einen deiner Charaktere",
            assigned_chars_found: "Ich habe einige Charaktere gefunden, die deinem Account zugeordnet sind. Bitte wähle einen als deinen Nicknamen aus:",
            not_on_list_label: "Nicht in der Liste",
            not_on_list_description: "Einen anderen Charakternamen manuell eingeben",
            character_not_found: "Ich konnte diesen Charakter nicht finden. Bitte versuche es mit einem gültigen Charakternamen erneut."
        }
    },
    logging: {
        error: 'Error',
        leveling_progress_removed: {
            title: 'Leveling Progress Removed',
            description: 'Leveling progress removed for {username}, {userId}>'
        },
        dm_sent: {
            title: 'DM Gesendet',
            description: 'Charakternamen-Anfrage DM an {username} gesendet'
        },
        member_banned: {
            title: 'Mitglied Gebannt',
            description: 'Blacklist-Benutzer gebannt',
            reason_label: 'Grund'
        },
        invite_created: {
            title: 'Einladung Erstellt',
            description: 'Neue Server-Einladung für {botName} Entwickler erstellt',
            channel: 'Kanal',
            created_by: 'Erstellt von'
        },
        footer: 'Server Logs',
        dm: {
            title: 'DM Fehlgeschlagen',
            description: 'Konnte keine DM an {username} senden',
            user_label: 'Benutzer',
            user_id: 'Benutzer ID',
            error_label: 'Fehler',
            response: 'Antwort',
            reason_label: 'Grund'
        },
        nickname_changed: {
            title: 'Nickname Geändert',
            description: 'Nickname für {username} zu {nickname} geändert',
            new_nickname: 'Neuer Nickname'
        },
        dm_timeout: {
            title: 'DM Antwort Zeitüberschreitung',
            description: '{username} hat nicht innerhalb der Zeitbegrenzung geantwortet'
        },
        interaction_failed: {
            title: 'Interaktion Fehlgeschlagen',
            description: 'Fehlgeschlagen, um mit {username} zu interagieren: {error}'
        }
    }
};