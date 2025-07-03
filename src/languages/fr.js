module.exports = {
    commands: {
        global_strings: {
            no_permission: 'Vous n\'avez pas les permissions nécessaires pour utiliser cette commande.',
            invalid_target: 'Cible invalide !',
            dm_failed: 'Impossible d\'envoyer un MP à {username}.',
            dm_sent: 'MP envoyé à {username}.',
            guild_only: 'Cette commande ne peut être utilisée que dans un serveur.',
            not_in_guild: 'Cette commande ne peut être utilisée que dans un serveur.',
            error_occurred: 'Une erreur s\'est produite : {error}',
            user_not_found: 'Utilisateur non trouvé.',
            bot_developer_only: 'Cette commande n\'est disponible que pour les développeurs du bot.'
        },
        charname: {
            dm_initial: 'Salut, j\'aimerais te demander le nom de ton personnage principal.\nVeuillez répondre avec le nom de votre personnage principal pour le serveur.\n\nVous avez 10 minutes pour répondre.',
            empty_response: 'Votre réponse ne peut pas être vide. Veuillez fournir une réponse valide.',
            nickname_success: 'Le nom de votre personnage principal a été changé avec succès en {nickname}.',
            nickname_failed: 'Impossible de changer le nom de votre personnage principal en raison de : {error}',
            dm_timeout_message: 'Temps expiré. Veuillez contacter un membre du personnel de {guildName} pour obtenir une nouvelle chance.'
        },
        globalcheck: {
            no_blacklisted: 'Il n\'y a pas d\'utilisateurs sur la liste noire.',
            no_blacklisted_guild: 'Il n\'y a pas d\'utilisateurs sur la liste noire dans ce serveur.',
            not_for_you: 'Ces boutons ne sont pas pour vous !',
            embed_title: 'Utilisateurs sur la liste noire',
            blacklisted_user: 'ID : <@{userId}>\nRaison : {reason}',
            BUTTONS: {
                KICK: 'Expulser',
                BAN: 'Bannir',
                NOTHING: 'Ne rien faire'
            },
            ACTION_RESULTS: {
                KICKED: '{COUNT} membres expulsés avec succès',
                BANNED: '{COUNT} membres bannis avec succès',
                NOTHING: 'Aucune action entreprise',
                FAILED: 'Impossible de traiter {COUNT} membres'
            },
            navigation: {
                previous: 'Précédent',
                next: 'Suivant'
            }
        },
        report: {
            modal: {
                title: 'Signaler un utilisateur',
                username_label: 'Nom d\'utilisateur de l\'utilisateur signalé ?',
                username_placeholder: 'Entrez le nom d\'utilisateur/ID discord ici !',
                reason_label: 'Raison',
                reason_placeholder: 'Entrez la raison ici !',
                evidence_label: 'Fournissez vos preuves.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            },
            submitted: 'Votre signalement a été soumis. Merci de nous aider à garder le serveur sûr.',
            report_title: 'Signalement d\'utilisateur',
            reported_user: 'Utilisateur signalé',
            reason: 'Raison',
            evidence: 'Preuves',
            reporter_id: 'ID du signaleur',
            submitted_by: 'Signalement soumis par {user}',
            send_failed: 'Impossible d\'envoyer le signalement au canal de modération.'
        },
        poll: {
            question_missing: 'La question du sondage est manquante.',
            answer_too_long: 'Une des réponses dépasse la limite de 55 caractères : "{answer}"',
            min_answers: 'Au moins deux réponses sont requises.',
            creation_failed: 'Impossible d\'envoyer un sondage au canal : {error}',
            created_pinned: 'Votre sondage a été créé et épinglé !',
            created: 'Votre sondage a été créé !'
        },
        charinfo: {
            loading: 'Nous recherchons vos données. Veuillez patienter.',
            char_not_exist: 'Le personnage {character} n\'existe pas.',
            embed: {
                title: 'Informations sur le personnage',
                description: 'Informations sur {character} - [Armurerie]({url})',
                fields: {
                    character: 'Personnage',
                    realm: 'Royaume',
                    online: 'En ligne',
                    level: 'Niveau',
                    yes: 'Oui',
                    no: 'Non',
                    gender: 'Genre',
                    race: 'Race',
                    class: 'Classe',
                    faction: 'Faction',
                    honorable_kills: 'Morts honorables',
                    guild: 'Guilde',
                    achievement_points: 'Points de succès',
                    talents: 'Talents',
                    no_guild: 'Aucune',
                    pvp_teams: 'Équipes PvP',
                    gearscore: 'Score d\'équipement',
                    missing_gems: 'Gemmes manquantes',
                    missing_enchants: 'Enchantements manquants',
                    none: 'Aucun',
                    professions: 'Métiers',
                    teams: 'Équipes PvP ({type}) : {name} (Classement : {rating}, Rang : {rank})',
                    belongs_to: 'Appartient à'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'Le MP de bienvenue n\'est pas activé.',
            updated: 'Le message de bienvenue a été mis à jour.'
        },
        servertime: {
            embed: {
                title: 'Heure du serveur',
                description: 'L\'heure actuelle du serveur est : {time}',
                footer: 'Demandé par : {user}'
            },
            error: 'Une erreur s\'est produite lors de la récupération de l\'heure du serveur.'
        },
        setwelcomechannel: {
            channel_set: 'Le canal de bienvenue a été défini sur {channel}.',
            error: 'Impossible de définir le canal de bienvenue en raison de : {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Commandes disponibles',
                DESCRIPTION: 'Voici une liste de toutes les commandes disponibles et leurs descriptions :',
                FOOTER: 'Demandé par {USER_TAG}'
            },
            NO_DESCRIPTION: 'Aucune description disponible',
            BUTTONS: {
                PREVIOUS: 'Précédent',
                NEXT: 'Suivant',
                BACK_TO_OVERVIEW: 'Retour à l\'aperçu'
            },
            command_not_found: 'Commande non trouvée. Utilisez `/help` pour voir toutes les commandes disponibles.',
            options: 'Options de commande'
        },
        setchar: {
            char_not_exist: 'Le personnage {character} n\'existe pas sur Warmane.',
            char_already_assigned: 'Le personnage {character} est déjà assigné à {user}.',
            already_has_main: '{user} a déjà un personnage principal : {character} ({realm}). Si c\'est une erreur, contactez un membre du personnel sur notre [Discord](https://discord.gg/YDqBQU43Ht).',
            success_with_type: '{character} ({realm}) a été défini avec succès comme personnage {type} pour {user}.',
            success: '{character} ({realm}) a été défini avec succès comme personnage principal pour {user}.',
            success_updated: 'Personnage principal pour {user} mis à jour de {oldCharacter} vers {character} ({realm}).'
        },
        charlist: {
            embed: {
                title: 'Personnages de {username}',
                no_characters: 'Aucun personnage trouvé pour cet utilisateur.',
                main_character: '**Personnage principal :**\n{name} - {realm}',
                alt_characters_header: '**Personnages alternatifs :**',
                character_entry: '{name} - {realm}'
            }
        },
        level: {
            no_progress: 'Aucun progrès de niveau trouvé pour cet utilisateur.',
            level_up: '🎉 Hey {user} vous avez atteint le niveau {level} ! Félicitations ! 🎉',
            disabled: 'Le système de niveau est désactivé sur ce serveur.',
            card_description: 'Image de carte de niveau'
        },
        setup: {
            title: 'Paramètres du serveur',
            description: 'Configurez les paramètres de votre serveur en cliquant sur les boutons ci-dessous. Chaque paramètre contrôle différents aspects de la fonctionnalité du bot.',
            no_permission: 'Vous devez être administrateur ou développeur pour utiliser cette commande.',
            no_button_permission: 'Vous devez être administrateur ou développeur pour utiliser ces paramètres.',
            different_user: 'Vous ne pouvez pas interagir avec le menu des paramètres de quelqu\'un d\'autre. Veuillez utiliser la commande /settings pour ouvrir le vôtre.',
            save_failed: 'Impossible de mettre à jour les paramètres. Veuillez réessayer.',
            menu_expired: 'Le menu des paramètres a expiré.',
            footer: 'Les paramètres seront automatiquement sauvegardés lors du basculement • L\'interface expire après 5 minutes',
            features: {
                welcome_message: {
                    name: '👋 Message de bienvenue',
                    description: 'Lorsqu\'activé, le bot enverra un message de bienvenue aux nouveaux membres dans le canal de bienvenue configuré.'
                },
                char_name_ask: {
                    name: '👤 Demande de nom de personnage',
                    description: 'Lorsqu\'activé, le bot demandera automatiquement aux nouveaux membres leur nom de personnage par MP et mettra à jour leur surnom en conséquence.'
                },
                block_list: {
                    name: '🚫 Liste de blocage',
                    description: 'Lorsqu\'activé, le bot utilise la liste noire globale pour bannir les membres qui sont sur la liste.'
                },
                logging: {
                    name: '📝 Journalisation',
                    description: 'Lorsqu\'activé, le bot enregistrera les événements importants qui sont exécutés par le bot en relation avec votre serveur.'
                },
                language: {
                    name: '🌍 Langue',
                    description: 'Changez la langue que le bot utilise sur votre serveur.',
                    current: 'Langue actuelle : {language}'
                },
                char_name: {
                    name: '👤 Nom de personnage',
                    description: 'Configurez les paramètres de nom de personnage pour votre serveur.'
                },
                status: {
                    enabled: '✅ Activé',
                    disabled: '❌ Désactivé',
                    channel: 'Canal : {channel}'
                },
                leveling: {
                    name: '📊 Système de niveau',
                    description: 'Configurez le système de niveau pour votre serveur.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Message de bienvenue',
                char_name_ask: 'Demande de nom de personnage',
                block_list: 'Liste de blocage',
                logging: 'Journalisation',
                change_language: 'Changer de langue',
                select_language: 'Sélectionner une langue',
                edit_charname_dm: 'Modifier le MP du nom de personnage',
                leveling: 'Système de niveau',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Sélectionner le canal de journalisation',
            select_welcome_channel: 'Sélectionner le canal de bienvenue',
            select_leveling_channel: 'Sélectionner le canal de niveau',
            log_channel_set: '✅ Canal de journalisation défini sur {channel}',
            not_set: 'Non défini',
            language_set: '✅ Langue du serveur définie sur {language}',
            leveling_channel_set: '✅ Canal de niveau défini sur {channel}',
            welcome_channel_set: '✅ Canal de bienvenue défini sur {channel}',
            charname_dm_modal: {
                title: 'Modifier le message MP du nom de personnage',
                message_label: 'Message MP',
                message_placeholder: 'Entrez le message à envoyer lors de la demande du nom de personnage...'
            },
            charname_dm_updated: '✅ Message MP du nom de personnage a été mis à jour',
            error_occurred: 'Une erreur s\'est produite : {error}'
        },
        account: {
            embed: {
                description: 'Informations de compte et statistiques',
                fields: {
                    account_info_title: '👤 Informations de compte',
                    username: 'Nom d\'utilisateur',
                    displayName: 'Nom d\'affichage',
                    id: 'ID',
                    created: 'Créé',
                    joined: 'A rejoint le serveur',
                    
                    activity_title: '📊 Statistiques d\'activité',
                    accountStanding: 'Statut du compte',
                    accountLevel: 'Niveau',
                    accountXP: 'Expérience',
                    xpProgress: 'Progrès de niveau',
                    voiceTime: 'Temps vocal',
                    serverProgress: 'Progrès du serveur',
                    serverLevel: 'Niveau du serveur',
                    serverXP: 'XP du serveur',
                    
                    roles_title: '🎭 Rôles [{count}]',
                    
                    badges_title: '🏅 Badges',
                    
                    tiers: {
                        veteran: '🔱 Artefact',
                        diamond: '💎 Légendaire',
                        gold: '🥇 Épique',
                        silver: '🥈 Rare',
                        bronze: '🥉 Commun'
                    }
                },
                footer: 'Informations de compte • {guildName}'
            }
        },
        testcontext: {
            title: 'Test d\'analyse de contexte',
            description: 'Mot de test : **{word}**',
            test_message: 'Message de test',
            result: 'Résultat',
            confidence: 'Confiance',
            threshold: 'Seuil',
            context_around_word: 'Contexte autour du mot',
            analysis_reasoning: 'Raisonnement d\'analyse',
            bot_action: 'Action du bot',
            appropriate_usage: 'Usage approprié',
            inappropriate_usage: 'Usage inapproprié',
            would_take_action: 'Prendrait une action (supprimer/avertir)',
            would_allow_message: 'Permettrait le message',
            and_more: '...et plus'
        },
        blacklistword: {
            word_already_exists: 'Le mot "{word}" est déjà sur la liste noire.',
            invalid_pagination_state: 'État de pagination invalide.',
            pagination_error: 'Une erreur s\'est produite lors de la mise à jour de la page.',
            word_not_found: 'Le mot "{word}" n\'est pas sur la liste noire.',
            no_words: 'Il n\'y a pas de mots sur la liste noire pour ce serveur.',
            no_global_words: 'Il n\'y a pas de mots globaux sur la liste noire.',
            added_title: '✅ Mot ajouté à la liste noire',
            added_description: 'Le mot "{word}" a été ajouté avec succès à la liste noire.',
            removed_title: '❌ Mot supprimé de la liste noire',
            removed_description: 'Le mot "{word}" a été supprimé avec succès de la liste noire.',
            list_title: '📝 Mots sur la liste noire',
            list_description: 'Voici tous les mots sur la liste noire pour ce serveur ({count} au total) :',
            global_list_title: '🌐 Mots globaux sur la liste noire',
            global_list_description: 'Voici tous les mots globaux sur la liste noire ({count} au total) :',
            page_info: 'Page {page} sur {totalPages}',
            toggle_title: '🔄 Statut du mot mis à jour',
            toggle_description: 'Le mot "{word}" a été {status}.',
            enabled: 'activé',
            disabled: 'désactivé',
            previous_page: 'Précédent',
            next_page: 'Suivant',
            no_reason: 'Aucune raison fournie',
            fields: {
                word: 'Mot',
                added_by: 'Ajouté par',
                removed_by: 'Supprimé par',
                toggled_by: 'Basculé par',
                reason: 'Raison',
                case_sensitive: 'Sensible à la casse',
                delete_message: 'Supprimer le message',
                warn_user: 'Avertir l\'utilisateur',
                context_analysis: 'Analyse de contexte',
                context_threshold: 'Seuil de contexte'
            },
            word_info: '**Ajouté par :** {addedBy}\n**Sensible à la casse :** {caseSensitive}\n**Supprimer le message :** {deleteMessage}\n**Avertir l\'utilisateur :** {warnUser}\n**Analyse de contexte :** {useContextAnalysis}\n**Seuil de contexte :** {contextThreshold}\n**Raison :** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Vous avez été mis sur la liste noire de la guilde. Si vous pensez que c\'est une erreur, veuillez contacter le personnel de la guilde. Ou faites appel sur https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Salut, j\'aimerais te demander le nom de ton personnage principal.\nVeuillez répondre avec le nom de votre personnage principal pour le serveur.',
            invalid_response: 'Votre réponse ne peut pas être vide ou trop longue.\nVeuillez fournir une réponse valide.',
            name_changed: 'Votre nom a été changé avec succès en {nickname} pour la guilde {guildName}.',
            name_change_failed: 'Impossible de changer votre nom en raison de : {error}',
            mod_notification: 'Impossible d\'envoyer la demande de nom de personnage à {username}. Ils ont probablement les MP désactivés.',
            welcome_title: 'Bienvenue sur {guildName} !',
            welcome_message: 'Bienvenue {member} sur notre serveur !\n\nSi vous avez des questions, n\'hésitez pas à les poser dans un canal public.',
            log_kicked: 'Expulsé {username} pour être sur la liste noire.',
            log_kick_failed: 'Impossible d\'expulser {username} en raison de : {error}',
            log_dm_failed: 'Impossible d\'envoyer un MP à {username}.',
            log_name_changed: 'Changé {username} en {nickname}.',
            log_name_change_failed: 'Impossible de changer {username} en {nickname} en raison de : {error}',
            log_end_message_failed: 'Impossible d\'envoyer le message de fin à {username} : {error}',
            log_interaction_failed: 'Impossible d\'interagir avec {username} : {error}',
            log_mod_notification_failed: 'Impossible d\'envoyer la notification de modérateur : {error}',
            select_character: 'Sélectionnez un de vos personnages',
            assigned_chars_found: 'J\'ai trouvé quelques personnages assignés à votre compte. Veuillez en sélectionner un pour l\'utiliser comme votre surnom :',
            not_on_list_label: 'Pas sur la liste',
            not_on_list_description: 'Entrez un nom de personnage différent manuellement',
            character_not_found: 'Je n\'ai pas pu trouver ce personnage. Veuillez réessayer avec un nom de personnage valide.'
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
            thanks_title: 'Merci de m\'avoir ajouté à {guildName} ! 🎉',
            description: 'Voici comment commencer à configurer le bot :',
            basic_commands: '📚 Commandes de base',
            help_command: '`/help` - Voir toutes les commandes disponibles',
            essential_setup: '⚙️ Configuration essentielle',
            setup_command: '`/setup` - Configurer toutes les fonctionnalités du bot :',
            setup_features: [
                '• Messages de bienvenue et canal',
                '• Système de nom de personnage',
                '• Protection de liste de blocage',
                '• Journalisation du serveur',
                '• Langue du bot',
                '• Messages MP personnalisés'
            ],
            character_management: '👤 Gestion des personnages',
            char_commands: [
                '`/set-char` - Assigner un personnage à un utilisateur',
                '`/charname` - Demander à un utilisateur son nom de personnage',
                'Vous pouvez aussi faire un clic droit sur un utilisateur et sélectionner "Demander le nom de personnage"'
            ],
            need_help: '🔗 Besoin d\'aide ?',
            support_server: '[Rejoignez notre serveur de support](https://discord.gg/YDqBQU43Ht)',
            footer: 'Amusez-vous en utilisant le bot ! 🤖'
        }
    },
    logging: {
        error: 'Erreur',
        footer: 'Logs du serveur',
        log_event: 'Événement de log',
        information: 'Information',
        no_value_provided: 'Aucune valeur fournie',
        missing_permissions_notification: 'Je n\'ai pas les permissions nécessaires pour envoyer des logs dans le canal de log configuré. Veuillez vous assurer que j\'ai les permissions suivantes : Voir le canal, Envoyer des messages et Lier des intégrations.',
        server_information: 'Informations du serveur',
        development_logs: 'Logs de développement',
        
        // Direct translations for field keys
        dm: {
            user_label: 'Utilisateur',
            user_id: 'ID utilisateur',
            error_label: 'Erreur',
            error: 'Erreur'
        },
        
        // Member events
        member_banned: {
            title: 'Membre banni',
            description: 'Utilisateur de liste noire banni',
            reason_label: 'Raison'
        },
        nickname_changed: {
            title: 'Surnom changé',
            description: 'Surnom changé pour {username} en {nickname}',
            new_nickname: 'Nouveau surnom'
        },
        
        // DM related logs
        dm_sent: {
            title: 'MP envoyé',
            description: 'MP de demande de nom de personnage envoyé à {username}'
        },
        dm_failed: {
            title: 'MP échoué',
            description: 'Impossible d\'envoyer un MP à {username}',
            user_label: 'Utilisateur',
            user_id: 'ID utilisateur',
            error_label: 'Erreur',
            response: 'Réponse',
            reason_label: 'Raison'
        },
        dm_timeout: {
            title: 'Délai d\'attente de réponse MP',
            description: '{username} n\'a pas répondu dans la limite de temps'
        },
        
        // System events
        invite_created: {
            title: 'Invitation créée',
            description: 'Nouvelle invitation de serveur créée pour les développeurs de {botName}',
            channel: 'Canal',
            created_by: 'Créé par'
        },
        interaction_failed: {
            title: 'Interaction échouée',
            description: 'Impossible d\'interagir avec {username}',
            error_label: 'Erreur',
            component_label: 'Composant'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Progrès de niveau supprimé',
            description: 'Progrès de niveau supprimé pour {username}, {userId}>'
        },
        level_up: {
            title: 'Montée de niveau',
            description: '{username} a atteint le niveau {level}',
            previous_level: 'Niveau précédent',
            current_level: 'Niveau actuel',
            xp_earned: 'XP gagnée'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Permission refusée',
            description: '{username} a tenté d\'utiliser {command} sans les permissions appropriées',
            required_permissions: 'Permissions requises',
            user_permissions: 'Permissions utilisateur'
        },
        
        // Command usage logs
        command_used: {
            title: 'Commande utilisée',
            description: '{username} a utilisé {command}',
            channel: 'Canal',
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