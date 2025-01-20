module.exports = {
    commands: {
        charname: {
            no_permission: "Du hast nicht die erforderlichen Berechtigungen für diesen Befehl.",
            invalid_target: "Ungültiges Ziel!",
            dm_initial: "Hey, ich würde gerne nach deinem Hauptcharakter-Namen fragen. Bitte antworte mit deinem Hauptcharakter-Namen.",
            dm_failed: "Konnte keine DM an {username} senden.",
            dm_sent: "Ich habe den Benutzer nach seinem Charakternamen gefragt.",
            empty_response: "Deine Antwort darf nicht leer sein. Bitte gib eine gültige Antwort.",
            nickname_success: "Dein Hauptcharakter-Name wurde erfolgreich zu {nickname} geändert.",
            nickname_failed: "Fehler beim Ändern deines Hauptcharakter-Namens: {error}"
        },
        language: {
            no_permission: "Du hast nicht die erforderlichen Berechtigungen für diesen Befehl.",
            success: "✅ Serversprache wurde auf {language} eingestellt."
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Du wurdest von der Gilde auf die schwarze Liste gesetzt. Wenn du denkst, dass dies ein Fehler ist, kontaktiere bitte das Gilden-Team oder melde dich unter https://discord.gg/YDqBQU43Ht",
            charname_ask: "Hey, ich würde gerne nach deinem Hauptcharakter-Namen fragen.\nBitte antworte mit deinem Hauptcharakter-Namen für den Server.\n\n(Deine Antwort wird nicht von dieser Anwendung gespeichert und wird nur für den Gildennamen verwendet)",
            invalid_response: "Deine Antwort darf nicht leer oder zu lang sein.\nBitte gib eine gültige Antwort ein.",
            name_changed: "Dein Name wurde erfolgreich zu {nickname} für die Gilde {guildName} geändert.",
            name_change_failed: "Fehler beim Ändern deines Namens: {error}",
            timeout: "Zeit abgelaufen! Kontaktiere einen Server-Admin, wenn du deinen Namen erneut ändern möchtest.",
            mod_notification: "Konnte keine Charakternamen-Anfrage an {username} senden. Wahrscheinlich sind deren DMs deaktiviert.",
            welcome_title: "Willkommen bei {guildName}!",
            welcome_message: "Willkommen {member} auf unserem Server!\n\nWenn du Fragen hast, kannst du diese gerne in einem öffentlichen Kanal stellen."
        }
    }
}; 