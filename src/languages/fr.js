module.exports = {
    commands: {
        global_strings: {
            no_permission: "Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
            invalid_target: "Cible invalide !",
            dm_failed: "Impossible d'envoyer un MP à {username}.",
            dm_sent: "MP envoyé à {username}.",
            guild_only: "Cette commande ne peut être utilisée que dans un serveur.",
            error_occurred: "Une erreur s'est produite : {error}"
        },
        charname: {
            dm_initial: "Bonjour, j'aimerais connaître le nom de votre personnage principal. Veuillez répondre avec le nom de votre personnage principal.",
            empty_response: "Votre réponse ne peut pas être vide. Veuillez fournir une réponse valide.",
            nickname_success: "Le nom de votre personnage principal a été changé avec succès en {nickname}.",
            nickname_failed: "Échec du changement du nom de votre personnage principal en raison de : {error}"
        },
        language: {
            success: "✅ La langue du serveur a été définie sur {language}."
        },
        globalcheck: {
            no_blacklisted: "Il n'y a pas d'utilisateurs sur liste noire.",
            no_blacklisted_guild: "Il n'y a pas d'utilisateurs sur liste noire dans ce serveur.",
            not_for_you: "Ces boutons ne sont pas pour vous !",
            embed_title: "Utilisateurs sur liste noire",
            blacklisted_user: "ID : <@{userId}>\nRaison : {reason}"
        },
        report: {
            modal: {
                title: "Signaler un utilisateur",
                username_label: "Nom d'utilisateur de la personne signalée ?",
                username_placeholder: "Entrez le nom d'utilisateur/ID discord ici !",
                reason_label: "Raison",
                reason_placeholder: "Entrez la raison ici !",
                evidence_label: "Fournissez vos preuves.",
                evidence_placeholder: "https://imgur.com/blablabla!"
            }
        },
        poll: {
            question_missing: "La question du sondage est manquante.",
            answer_too_long: "Une des réponses dépasse la limite de 55 caractères : \"{answer}\"",
            min_answers: "Au moins deux réponses sont requises.",
            creation_failed: "Impossible de créer le sondage : {error}",
            created_pinned: "Votre sondage a été créé et épinglé !",
            created: "Votre sondage a été créé !"
        },
        charinfo: {
            loading: "Nous recherchons vos données. Veuillez patienter.",
            char_not_exist: "Le personnage {character} n'existe pas.",
            embed: {
                title: "Informations sur le personnage",
                description: "Informations sur {character} - [Armurerie]({url})",
                fields: {
                    character: "Personnage",
                    realm: "Royaume",
                    online: "En ligne",
                    level: "Niveau",
                    yes: "Oui",
                    no: "Non",
                    gender: "Genre",
                    race: "Race",
                    class: "Classe",
                    faction: "Faction",
                    honorable_kills: "Victoires honorables",
                    guild: "Guilde",
                    achievement_points: "Points de haut fait",
                    talents: "Talents",
                    no_guild: "Aucune",
                    pvp_teams: "Équipes JcJ",
                    gearscore: "Score d'équipement",
                    missing_gems: "Gemmes manquantes",
                    missing_enchants: "Enchantements manquants",
                    none: "Aucun",
                    professions: "Métiers",
                    teams: "Équipes JcJ ({type}): {name} (Cote: {rating}, Rang: {rank})"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "Le message de bienvenue en MP n'est pas activé.",
            updated: "Le message de bienvenue a été mis à jour."
        },
        servertime: {
            embed: {
                title: "Heure du serveur",
                description: "L'heure actuelle du serveur est: {time}",
                footer: "Demandé par: {user}"
            }
        },
        setwelcomechannel: {
            channel_set: "Le salon de bienvenue a été défini sur {channel}.",
            error: "Impossible de définir le salon de bienvenue en raison de: {error}"
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Vous avez été mis sur la liste noire de la guilde. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le personnel de la guilde ou faire appel sur https://discord.gg/YDqBQU43Ht",
            invalid_response: "Votre réponse ne peut pas être vide ou trop longue.\nVeuillez fournir une réponse valide.",
            name_changed: "Votre nom a été changé avec succès en {nickname} pour la guilde {guildName}.",
            name_change_failed: "Échec du changement de votre nom : {error}",
            timeout: "Temps écoulé ! Contactez un administrateur du serveur si vous souhaitez changer à nouveau votre nom.",
            mod_notification: "Impossible d'envoyer la demande de nom de personnage à {username}. Leurs MPs sont probablement désactivés.",
            welcome_title: "Bienvenue sur {guildName} !",
            welcome_message: "Bienvenue {member} sur notre serveur !\n\nSi vous avez des questions, n'hésitez pas à les poser dans un canal public.",
            log_kicked: "{username} a été expulsé car il est sur liste noire.",
            log_kick_failed: "Impossible d'expulser {username} : {error}",
            log_dm_failed: "Impossible d'envoyer un MP à {username}.",
            log_name_changed: "Le nom de {username} a été changé en {nickname}.",
            log_name_change_failed: "Impossible de changer le nom de {username} en {nickname} : {error}",
            log_end_message_failed: "Impossible d'envoyer le message final à {username} : {error}",
            log_interaction_failed: "Impossible d'interagir avec {username} : {error}",
            log_mod_notification_failed: "Impossible d'envoyer la notification aux modérateurs : {error}"
        }
    }
}; 