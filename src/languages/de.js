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
            dm_initial: "Hey, ich möchte dich nach deinem Hauptcharakternamen fragen. Bitte antworte mit deinem Hauptcharakternamen.",
            empty_response: "Deine Antwort darf nicht leer sein. Bitte gib eine gültige Antwort.",
            nickname_success: "Dein Hauptcharaktername wurde erfolgreich zu {nickname} geändert.",
            nickname_failed: "Fehler beim Ändern deines Hauptcharakternamens: {error}"
        },
        language: {
            success: "✅ Serversprache wurde auf {language} eingestellt."
        },
        globalcheck: {
            no_blacklisted: "Es gibt keine Benutzer auf der schwarzen Liste.",
            no_blacklisted_guild: "Es gibt keine Benutzer auf der schwarzen Liste in diesem Server.",
            not_for_you: "Diese Schaltflächen sind nicht für dich!",
            embed_title: "Benutzer auf der schwarzen Liste",
            blacklisted_user: "ID: <@{userId}>\nGrund: {reason}"
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
                    teams: "PvP Teams ({type}): {name} (Wertung: {rating}, Rang: {rank})"
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
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Du wurdest von der Gilde auf die schwarze Liste gesetzt. Wenn du denkst, dass dies ein Fehler ist, kontaktiere bitte die Gildenleitung oder melde dich unter https://discord.gg/YDqBQU43Ht",
            invalid_response: "Deine Antwort darf nicht leer oder zu lang sein.\nBitte gib eine gültige Antwort.",
            name_changed: "Dein Name wurde erfolgreich zu {nickname} für die Gilde {guildName} geändert.",
            name_change_failed: "Fehler beim Ändern deines Namens: {error}",
            timeout: "Zeit abgelaufen! Kontaktiere einen Mitarbeiter des Servers, wenn du deinen Namen ändern möchtest.",
            mod_notification: "Konnte keine Charakternamenanfrage an {username} senden. Wahrscheinlich sind DMs deaktiviert.",
            welcome_title: "Willkommen bei {guildName}!",
            welcome_message: "Willkommen {member} auf unserem Server!\n\nWenn du Fragen hast, kannst du sie gerne in einem öffentlichen Kanal stellen.",
            log_kicked: "{username} wurde aufgrund der schwarzen Liste gekickt.",
            log_kick_failed: "Konnte {username} nicht kicken: {error}",
            log_dm_failed: "Konnte keine DM an {username} senden.",
            log_name_changed: "Name von {username} zu {nickname} geändert.",
            log_name_change_failed: "Konnte den Namen von {username} nicht zu {nickname} ändern: {error}",
            log_end_message_failed: "Konnte keine Abschlussnachricht an {username} senden: {error}",
            log_interaction_failed: "Konnte nicht mit {username} interagieren: {error}",
            log_mod_notification_failed: "Konnte keine Mod-Benachrichtigung senden: {error}"
        }
    }
}; 