module.exports = {
    commands: {
        global_strings: {
            no_permission: 'No tienes los permisos necesarios para usar este comando.',
            invalid_target: '¡Objetivo inválido!',
            dm_failed: 'No se pudo enviar un MD a {username}.',
            dm_sent: 'MD enviado a {username}.',
            guild_only: 'Este comando solo puede ser usado en un servidor.',
            error_occurred: 'Ocurrió un error: {error}',
            user_not_found: 'Usuario no encontrado.'
        },
        charname: {
            dm_initial: 'Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.\n\nTienes 10 minutos para responder.',
            empty_response: 'Tu respuesta no puede estar vacía. Por favor, proporciona una respuesta válida.',
            nickname_success: 'El nombre de tu personaje principal ha sido cambiado exitosamente a {nickname}.',
            nickname_failed: 'No se pudo cambiar el nombre de tu personaje principal debido a: {error}',
            dm_timeout_message: 'Tiempo expirado. Por favor, contacta con un miembro del personal de {guildName} para obtener una nueva oportunidad.'
        },
        globalcheck: {
            no_blacklisted: 'No hay usuarios en la lista negra.',
            no_blacklisted_guild: 'No hay usuarios en la lista negra en este servidor.',
            not_for_you: '¡Estos botones no son para ti!',
            embed_title: 'Usuarios en lista negra',
            blacklisted_user: 'ID: <@{userId}>\nRazón: {reason}',
            BUTTONS: {
                KICK: 'Expulsar',
                BAN: 'Banear',
                NOTHING: 'No hacer nada'
            },
            ACTION_RESULTS: {
                KICKED: 'Se expulsaron {COUNT} miembros exitosamente',
                BANNED: 'Se banearon {COUNT} miembros exitosamente',
                NOTHING: 'No se tomó ninguna acción',
                FAILED: 'No se pudieron procesar {COUNT} miembros'
            }
        },
        report: {
            modal: {
                title: 'Reportar usuario',
                username_label: '¿Nombre de usuario del usuario reportado?',
                username_placeholder: '¡Ingresa el nombre de usuario/ID de discord aquí!',
                reason_label: 'Razón',
                reason_placeholder: '¡Ingresa la razón aquí!',
                evidence_label: 'Proporciona tu evidencia.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            }
        },
        poll: {
            question_missing: 'Falta la pregunta de la encuesta.',
            answer_too_long: 'Una de las respuestas excede el límite de 55 caracteres: "{answer}"',
            min_answers: 'Se requieren al menos dos respuestas.',
            creation_failed: 'No se pudo crear la encuesta: {error}',
            created_pinned: '¡Tu encuesta ha sido creada y fijada!',
            created: '¡Tu encuesta ha sido creada!'
        },
        charinfo: {
            loading: 'Estamos buscando tus datos. Por favor, ten paciencia.',
            char_not_exist: 'El personaje {character} no existe.',
            embed: {
                title: 'Información del personaje',
                description: 'Información sobre {character} - [Armería]({url})',
                fields: {
                    character: 'Personaje',
                    realm: 'Reino',
                    online: 'En línea',
                    level: 'Nivel',
                    yes: 'Sí',
                    no: 'No',
                    gender: 'Género',
                    race: 'Raza',
                    class: 'Clase',
                    faction: 'Facción',
                    honorable_kills: 'Muertes honorables',
                    guild: 'Hermandad',
                    achievement_points: 'Puntos de logro',
                    talents: 'Talentos',
                    no_guild: 'Ninguna',
                    pvp_teams: 'Equipos PvP',
                    gearscore: 'Puntuación de equipo',
                    missing_gems: 'Gemas faltantes',
                    missing_enchants: 'Encantamientos faltantes',
                    none: 'Ninguno',
                    professions: 'Profesiones',
                    teams: 'Equipos PvP ({type}): {name} (Clasificación: {rating}, Rango: {rank})',
                    belongs_to: 'Pertenece a'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'El MD de bienvenida no está habilitado.',
            updated: 'El mensaje de bienvenida ha sido actualizado.'
        },
        servertime: {
            embed: {
                title: 'Hora del servidor',
                description: 'La hora actual del servidor es: {time}',
                footer: 'Solicitado por: {user}'
            }
        },
        setwelcomechannel: {
            channel_set: 'El canal de bienvenida ha sido establecido en {channel}.',
            error: 'Error al establecer el canal de bienvenida: {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Comandos disponibles',
                DESCRIPTION: 'Aquí hay una lista de todos los comandos disponibles y sus descripciones:',
                FOOTER: 'Solicitado por {USER_TAG}'
            },
            NO_DESCRIPTION: 'No hay descripción disponible',
            BUTTONS: {
                PREVIOUS: 'Anterior',
                NEXT: 'Siguiente'
            }
        },
        setchar: {
            char_not_exist: 'El personaje {character} no existe en Warmane.',
            char_already_assigned: 'El personaje {character} ya está asignado a {user}.',
            already_has_main: '{user} ya tiene un personaje principal: {character} ({realm}). Si esto es un error, contacta a un miembro del personal en nuestro [Discord](https://discord.gg/YDqBQU43Ht).',
            success_with_type: '{character} ({realm}) ha sido establecido exitosamente como personaje {type} para {user}.',
            success: '{character} ({realm}) ha sido establecido exitosamente como personaje principal para {user}.',
            success_updated: 'Personaje principal para {user} actualizado de {oldCharacter} a {character} ({realm}).'
        },
        charlist: {
            embed: {
                title: 'Personajes de {username}',
                no_characters: 'No se encontraron personajes para este usuario.',
                main_character: '**Personaje Principal:**\n{name} - {realm}',
                alt_characters_header: '**Personajes Alternativos:**',
                character_entry: '{name} - {realm}'
            }
        },
        level: {
            no_progress: 'Aún no has alcanzado ningún nivel.',
            level_up: '🎉 Hey {user} has alcanzado el nivel {level}! ¡Felicidades! 🎉',
            disabled: 'El sistema de nivelación está desactivado en este servidor.'
        },

        setup: {
            title: 'Ajustes del Servidor',
            description: 'Configura los ajustes de tu servidor haciendo clic en los botones de abajo. Cada ajuste controla diferentes aspectos de la funcionalidad del bot.',
            no_permission: 'Necesitas ser administrador o desarrollador para usar este comando.',
            no_button_permission: 'Necesitas ser administrador o desarrollador para usar estos ajustes.',
            different_user: 'No puedes interactuar con el menú de ajustes de otra persona. Por favor, usa el comando /settings para abrir el tuyo.',
            save_failed: 'Error al actualizar los ajustes. Por favor, inténtalo de nuevo.',
            menu_expired: 'El menú de ajustes ha expirado.',
            footer: 'Los ajustes se guardarán automáticamente al cambiarlos • La interfaz expira después de 5 minutos',
            features: {
                welcome_message: {
                    name: '👋 Mensaje de Bienvenida',
                    description: 'Cuando está activado, el bot enviará un mensaje de bienvenida a los nuevos miembros en el canal de bienvenida configurado.'
                },
                char_name_ask: {
                    name: '👤 Preguntar Nombre de Personaje',
                    description: 'Cuando está activado, el bot automáticamente enviará un MD a los nuevos miembros preguntando por su nombre de personaje y actualizará su apodo en consecuencia.'
                },
                block_list: {
                    name: '🚫 Lista Negra',
                    description: 'Cuando está activado, el bot usa la Lista Negra global para banear miembros que están en la lista.'
                },
                logging: {
                    name: '📝 Registro',
                    description: 'Cuando está activado, el bot registrará eventos importantes que son ejecutados por el bot en relación con tu servidor.'
                },
                language: {
                    name: '🌍 Idioma',
                    description: 'Cambia el idioma que el bot usa en tu servidor.',
                    current: 'Idioma actual: {language}'
                },
                char_name: {
                    name: '👤 Nombre de Personaje',
                    description: 'Configura los ajustes de nombre de personaje para tu servidor.'
                },
                status: {
                    enabled: '✅ Activado',
                    disabled: '❌ Desactivado',
                    channel: 'Canal: {channel}'
                },
                leveling: {
                    name: '📊 Sistema de Nivelación',
                    description: 'Configura el sistema de nivelación para tu servidor.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Mensaje de Bienvenida',
                char_name_ask: 'Preguntar Nombre de Personaje',
                block_list: 'Lista Negra',
                logging: 'Registro',
                change_language: 'Cambiar Idioma',
                select_language: 'Seleccionar idioma',
                edit_charname_dm: 'Editar DM del nombre',
                leveling: 'Sistema de Nivelación',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Seleccionar canal de registro',
            select_welcome_channel: 'Seleccionar canal de bienvenida',
            select_leveling_channel: 'Seleccionar canal de nivelación',
            log_channel_set: '✅ Canal de registro establecido en {channel}',
            not_set: 'No establecido',
            language_set: '✅ El idioma del servidor se ha establecido en {language}',
            leveling_channel_set: '✅ Canal de nivelación establecido en {channel}',
            welcome_channel_set: '✅ Canal de bienvenida establecido en {channel}',
            charname_dm_modal: {
                title: 'Editar mensaje DM del nombre de personaje',
                message_label: 'Mensaje DM',
                message_placeholder: 'Ingresa el mensaje a enviar cuando se pregunte por el nombre del personaje...'
            },
            charname_dm_updated: '✅ Mensaje DM del nombre de personaje ha sido actualizado',
            error_occurred: 'Ocurrió un error: {error}'
        },
        account: {
            embed: {
                description: 'Información de cuenta y estadísticas',
                fields: {
                    account_info_title: '👤 Información de Cuenta',
                    username: 'Nombre de usuario',
                    displayName: 'Nombre mostrado',
                    id: 'ID',
                    created: 'Creado',
                    joined: 'Se unió al servidor',
                    
                    activity_title: '📊 Estadísticas de Actividad',
                    accountStanding: 'Estado de la cuenta',
                    accountLevel: 'Nivel',
                    accountXP: 'Experiencia',
                    xpProgress: 'Progreso de nivel',
                    voiceTime: 'Tiempo de voz',
                    serverProgress: 'Progreso del servidor',
                    serverLevel: 'Nivel del servidor',
                    serverXP: 'XP del servidor',
                    
                    roles_title: '🎭 Roles [{count}]',
                    badges_title: '🏅 Insignias',
                    
                    tiers: {
                        veteran: '🔱 Artefacto',
                        diamond: '💎 Legendario',
                        gold: '🥇 Épico',
                        silver: '🥈 Raro',
                        bronze: '🥉 Común'
                    }
                },
                footer: 'Información de Cuenta • {guildName}'
            }
        },
        blacklistword: {
            word_already_exists: 'La palabra "{word}" ya está en la lista negra.',
            word_not_found: 'La palabra "{word}" no está en la lista negra.',
            no_words: 'No hay palabras en la lista negra para este servidor.',
            added_title: '✅ Palabra agregada a la lista negra',
            added_description: 'La palabra "{word}" ha sido agregada exitosamente a la lista negra.',
            removed_title: '❌ Palabra removida de la lista negra',
            removed_description: 'La palabra "{word}" ha sido removida exitosamente de la lista negra.',
            list_title: '📝 Palabras en lista negra',
            list_description: 'Aquí están todas las palabras en lista negra para este servidor ({count} en total):',
            page_info: 'Página {page} de {totalPages}',
            toggle_title: '🔄 Estado de palabra actualizado',
            toggle_description: 'La palabra "{word}" ha sido {status}.',
            enabled: 'habilitada',
            disabled: 'deshabilitada',
            previous_page: 'Anterior',
            next_page: 'Siguiente',
            no_reason: 'Sin razón proporcionada',
            fields: {
                word: 'Palabra',
                added_by: 'Agregado por',
                removed_by: 'Removido por',
                toggled_by: 'Cambiado por',
                reason: 'Razón',
                case_sensitive: 'Sensible a mayúsculas',
                delete_message: 'Eliminar mensaje',
                warn_user: 'Advertir usuario',
                context_analysis: 'Análisis de contexto',
                context_threshold: 'Umbral de contexto'
            },
            word_info: '**Agregado por:** {addedBy}\n**Sensible a mayúsculas:** {caseSensitive}\n**Eliminar mensaje:** {deleteMessage}\n**Advertir usuario:** {warnUser}\n**Análisis de contexto:** {useContextAnalysis}\n**Umbral de contexto:** {contextThreshold}\n**Razón:** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Has sido puesto en la lista negra de la Hermandad. Si crees que esto es un error, por favor contacta al personal de la Hermandad o apela en https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.',
            invalid_response: 'Tu respuesta no puede estar vacía o ser muy larga.\nPor favor, proporciona una respuesta válida.',
            name_changed: 'Tu nombre ha sido cambiado exitosamente a {nickname} para la Hermandad {guildName}.',
            name_change_failed: 'Error al cambiar tu nombre: {error}',
            mod_notification: 'No se pudo enviar la solicitud de nombre de personaje a {username}. Probablemente tienen los MD deshabilitados.',
            welcome_title: '¡Bienvenido a {guildName}!',
            welcome_message: '¡Bienvenido {member} a nuestro servidor!\n\nSi tienes alguna pregunta, no dudes en preguntar en un canal público.',
            log_kicked: 'Expulsado {username} por estar en la lista negra.',
            log_kick_failed: 'No se pudo expulsar a {username}: {error}',
            log_dm_failed: 'No se pudo enviar MD a {username}.',
            log_name_changed: 'Nombre de {username} cambiado a {nickname}.',
            log_name_change_failed: 'No se pudo cambiar el nombre de {username} a {nickname}: {error}',
            log_end_message_failed: 'No se pudo enviar mensaje final a {username}: {error}',
            log_interaction_failed: 'No se pudo interactuar con {username}: {error}',
            log_mod_notification_failed: 'No se pudo enviar notificación de moderador: {error}',
            select_character: 'Selecciona uno de tus personajes',
            assigned_chars_found: 'Encontré algunos personajes asignados a tu cuenta. Por favor, selecciona uno para usar como tu apodo:',
            not_on_list_label: 'No está en la lista',
            not_on_list_description: 'Ingresa un nombre de personaje diferente manualmente',
            character_not_found: 'No pude encontrar ese personaje. Por favor, intenta de nuevo con un nombre de personaje válido.'
        },
        blacklisted_word: {
            title: '🚫 Blacklisted Word Detected',
            description: '{username}, your message contained blacklisted word(s): **{words}**\nPlease avoid using these words in the future.',
            fields: {
                channel: 'Channel',
                message_id: 'Message ID',
                context_analysis: 'Context Analysis'
            }
        }
    },
    logging: {
        error: 'Error',
        footer: 'Server Logs',
        
        // Direct translations for field keys
        dm: {
            user_label: 'Usuario',
            user_id: 'ID de usuario',
            error_label: 'Error',
            error: 'Error'
        },
        
        // Member events
        member_banned: {
            title: 'Miembro Baneado',
            description: 'Usuario de lista negra baneado',
            reason_label: 'Razón'
        },
        nickname_changed: {
            title: 'Apodo Cambiado',
            description: 'Apodo cambiado para {username} a {nickname}',
            new_nickname: 'Nuevo apodo'
        },
        
        // DM related logs
        dm_sent: {
            title: 'MD Enviado',
            description: 'Solicitud de nombre de personaje MD enviada a {username}'
        },
        dm_failed: {
            title: 'MD Fallido',
            description: 'No se pudo enviar MD a {username}',
            user_label: 'Usuario',
            user_id: 'ID de usuario',
            error_label: 'Error',
            response: 'Respuesta',
            reason_label: 'Razón'
        },
        dm_timeout: {
            title: 'Tiempo de espera de respuesta MD',
            description: '{username} no respondió dentro del límite de tiempo'
        },
        
        // System events
        invite_created: {
            title: 'Invitación Creada',
            description: 'Nueva invitación de servidor creada para desarrolladores de {botName}',
            channel: 'Canal',
            created_by: 'Creado por'
        },
        interaction_failed: {
            title: 'Interacción Fallida',
            description: 'No se pudo interactuar con {username}',
            error_label: 'Error',
            component_label: 'Componente'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Progreso de Nivelación Removido',
            description: 'Progreso de nivelación removido para {username}, {userId}>'
        },
        level_up: {
            title: 'Subida de Nivel',
            description: '{username} ha alcanzado el nivel {level}',
            previous_level: 'Nivel anterior',
            current_level: 'Nivel actual',
            xp_earned: 'XP ganada'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Permiso Denegado',
            description: '{username} intentó usar {command} sin los permisos adecuados',
            required_permissions: 'Permisos requeridos',
            user_permissions: 'Permisos de usuario'
        },
        
        // Command usage logs
        command_used: {
            title: 'Comando Usado',
            description: '{username} usó {command}',
            channel: 'Canal',
            options: 'Opciones'
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