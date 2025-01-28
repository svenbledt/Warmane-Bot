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
            dm_initial: "Salut, j'aimerais connaître le nom de ton personnage principal.\nMerci de répondre avec le nom de ton personnage principal pour le serveur.\n\nTu as 10 minutes pour répondre.",
            empty_response: "Ta réponse ne peut pas être vide. Merci de fournir une réponse valide.",
            nickname_success: "Le nom de ton personnage principal a été changé avec succès en {nickname}.",
            nickname_failed: "Échec du changement du nom de ton personnage principal : {error}",
            dm_timeout_message: "Temps expiré. Veuillez contacter un membre du personnel de {guildName} pour obtenir une nouvelle chance."
        },
        language: {
            success: "✅ La langue du serveur a été définie sur {language}."
        },
        globalcheck: {
            no_blacklisted: "Il n'y a pas d'utilisateurs sur liste noire.",
            no_blacklisted_guild: "Il n'y a pas d'utilisateurs sur liste noire dans ce serveur.",
            not_for_you: "Ces boutons ne sont pas pour vous !",
            embed_title: "Utilisateurs sur liste noire",
            blacklisted_user: "ID : <@{userId}>\nRaison : {reason}",
            BUTTONS: {
                KICK: "Expulser",
                BAN: "Bannir",
                NOTHING: "Ne rien faire"
            },
            ACTION_RESULTS: {
                KICKED: "%COUNT% membres expulsés avec succès",
                BANNED: "%COUNT% membres bannis avec succès",
                NOTHING: "Aucune action effectuée",
                FAILED: "Échec du traitement de %COUNT% membres"
            }
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
                    teams: "Équipes JcJ ({type}): {name} (Cote: {rating}, Rang: {rank})",
                    belongs_to: "Appartient à"
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
        },
        help: {
            EMBED: {
                TITLE: "Commandes Disponibles",
                DESCRIPTION: "Voici une liste de toutes les commandes disponibles et leurs descriptions :",
                FOOTER: "Demandé par {USER_TAG}"
            },
            NO_DESCRIPTION: "Aucune description disponible",
            BUTTONS: {
                PREVIOUS: "Précédent",
                NEXT: "Suivant"
            }
        },
        setchar: {
            char_not_exist: "Le personnage {character} n'existe pas sur Warmane.",
            char_already_assigned: "Le personnage {character} est déjà assigné à {user}.",
            already_has_main: "{user} a déjà un personnage principal: {character} ({realm}). Si c'est une erreur, contactez un membre du staff sur notre [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "{character} ({realm}) a été défini comme personnage {type} pour {user}.",
            success: "{character} ({realm}) a été défini comme personnage principal pour {user}.",
            success_updated: "Personnage principal de {user} changé de {oldCharacter} à {character} ({realm})."
        },
        charlist: {
            embed: {
                title: "Personnages de {username}",
                no_characters: "Aucun personnage trouvé pour cet utilisateur.",
                main_character: "**Personnage Principal:**\n{name} - {realm}",
                alt_characters_header: "**Personnages Alternatifs:**",
                character_entry: "{name} - {realm}"
            }
        },
        setlogchannel: {
            invalid_channel: "Veuillez sélectionner un canal textuel pour la journalisation.",
            success: "Le canal de journalisation a été défini sur #{channelName}.",
            success_with_enable: "Le canal de journalisation a été défini sur #{channelName} et la journalisation a été activée.",
            no_channel_set: "Aucun canal de journalisation n'a été défini. Veuillez utiliser `/set-logchannel` pour en définir un."
        },
        settings: {
            logging_enabled: "Journalisation du Serveur",
            logging_no_channel: "⚠️ La journalisation est activée mais aucun canal n'est défini. Utilisez `/set-logchannel` pour en définir un."
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
            log_mod_notification_failed: "Impossible d'envoyer la notification aux modérateurs : {error}",
            select_character: "Sélectionnez l'un de vos personnages",
            assigned_chars_found: "J'ai trouvé des personnages associés à votre compte. Veuillez en sélectionner un à utiliser comme pseudo :",
            not_on_list_label: "Pas dans la liste",
            not_on_list_description: "Entrer un autre nom de personnage manuellement",
            character_not_found: "Je n'ai pas trouvé ce personnage. Veuillez réessayer avec un nom de personnage valide."
        },
        nickname_changed: {
            title: 'Surnom Modifié',
            description: 'Surnom de {username} changé en {nickname}',
            new_nickname: 'Nouveau Surnom'
        }
    },
    logging: {
        dm_sent: {
            title: 'MP Envoyé',
            description: 'MP de demande de nom de personnage envoyé à {username}'
        },
        member_banned: {
            title: 'Membre Banni',
            description: 'Utilisateur de la liste noire banni',
            reason_label: 'Raison'
        },
        invite_created: {
            title: 'Invitation Créée',
            description: 'Nouvelle invitation du serveur créée pour les développeurs de {botName}',
            channel: 'Canal',
            created_by: 'Créé par'
        },
        user_label: 'Utilisateur',
        user_id: 'ID Utilisateur',
        footer: 'Journaux du Serveur',
        dm_failed: {
            title: 'Échec du MP',
            description: 'Impossible d\'envoyer un MP à {username}',
            error_label: 'Erreur'
        },
        dm_timeout: {
            title: 'Délai de Réponse DM Dépassé',
            description: '{username} n\'a pas répondu dans le délai imparti'
        },
        nickname_changed: {
            title: 'Surnom Modifié',
            description: 'Surnom de {username} changé en {nickname}',
            new_nickname: 'Nouveau Surnom'
        }
    }
}; 