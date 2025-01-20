module.exports = {
    commands: {
        charname: {
            no_permission: "Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
            invalid_target: "Cible invalide !",
            dm_initial: "Bonjour, j'aimerais connaître le nom de votre personnage principal. Veuillez répondre avec le nom de votre personnage principal.",
            dm_failed: "Impossible d'envoyer un message privé à {username}.",
            dm_sent: "J'ai demandé à l'utilisateur le nom de son personnage.",
            empty_response: "Votre réponse ne peut pas être vide. Veuillez fournir une réponse valide.",
            nickname_success: "Le nom de votre personnage principal a été changé avec succès en {nickname}.",
            nickname_failed: "Échec du changement du nom de votre personnage principal en raison de : {error}"
        },
        language: {
            no_permission: "Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
            success: "✅ La langue du serveur a été définie sur {language}."
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Vous avez été mis sur la liste noire de la guilde. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le personnel de la guilde ou faire appel sur https://discord.gg/YDqBQU43Ht",
            charname_ask: "Bonjour, j'aimerais connaître le nom de votre personnage principal.\nVeuillez répondre avec le nom de votre personnage principal pour le serveur.\n\n(Votre réponse ne sera pas stockée par cette application et n'est utilisée que pour le surnom de la guilde)",
            invalid_response: "Votre réponse ne peut pas être vide ou trop longue.\nVeuillez fournir une réponse valide.",
            name_changed: "Votre nom a été changé avec succès en {nickname} pour la guilde {guildName}.",
            name_change_failed: "Échec du changement de votre nom : {error}",
            timeout: "Temps écoulé ! Contactez un administrateur du serveur si vous souhaitez changer à nouveau votre nom.",
            mod_notification: "Impossible d'envoyer la demande de nom de personnage à {username}. Leurs MPs sont probablement désactivés.",
            welcome_title: "Bienvenue sur {guildName} !",
            welcome_message: "Bienvenue {member} sur notre serveur !\n\nSi vous avez des questions, n'hésitez pas à les poser dans un canal public."
        }
    }
}; 