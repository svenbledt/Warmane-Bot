module.exports = {
    commands: {
        global_strings: {
            no_permission: "No tienes los permisos necesarios para usar este comando.",
            invalid_target: "¡Objetivo inválido!",
            dm_failed: "No se pudo enviar un MD a {username}.",
            dm_sent: "MD enviado a {username}.",
            guild_only: "Este comando solo puede ser usado en un servidor.",
            error_occurred: "Ocurrió un error: {error}"
        },
        charname: {
            dm_initial: "Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.\n\nTienes 10 minutos para responder.",
            empty_response: "Tu respuesta no puede estar vacía. Por favor, proporciona una respuesta válida.",
            nickname_success: "El nombre de tu personaje principal ha sido cambiado exitosamente a {nickname}.",
            nickname_failed: "No se pudo cambiar el nombre de tu personaje principal debido a: {error}",
            dm_timeout_message: "Tiempo expirado. Por favor, contacta con un miembro del personal de {guildName} para obtener una nueva oportunidad."
        },
        language: {
            success: "✅ El idioma del servidor ha sido establecido a {language}."
        },
        globalcheck: {
            no_blacklisted: "No hay usuarios en la lista negra.",
            no_blacklisted_guild: "No hay usuarios en la lista negra en este servidor.",
            not_for_you: "¡Estos botones no son para ti!",
            embed_title: "Usuarios en lista negra",
            blacklisted_user: "ID: <@{userId}>\nRazón: {reason}",
            BUTTONS: {
                KICK: "Expulsar",
                BAN: "Banear",
                NOTHING: "No hacer nada"
            },
            ACTION_RESULTS: {
                KICKED: "Se expulsaron %COUNT% miembros exitosamente",
                BANNED: "Se banearon %COUNT% miembros exitosamente",
                NOTHING: "No se tomó ninguna acción",
                FAILED: "No se pudieron procesar %COUNT% miembros"
            }
        },
        report: {
            modal: {
                title: "Reportar usuario",
                username_label: "¿Nombre de usuario del usuario reportado?",
                username_placeholder: "¡Ingresa el nombre de usuario/ID de discord aquí!",
                reason_label: "Razón",
                reason_placeholder: "¡Ingresa la razón aquí!",
                evidence_label: "Proporciona tu evidencia.",
                evidence_placeholder: "https://imgur.com/blablabla!"
            }
        },
        poll: {
            question_missing: "Falta la pregunta de la encuesta.",
            answer_too_long: "Una de las respuestas excede el límite de 55 caracteres: \"{answer}\"",
            min_answers: "Se requieren al menos dos respuestas.",
            creation_failed: "No se pudo crear la encuesta: {error}",
            created_pinned: "¡Tu encuesta ha sido creada y fijada!",
            created: "¡Tu encuesta ha sido creada!"
        },
        charinfo: {
            loading: "Estamos buscando tus datos. Por favor, ten paciencia.",
            char_not_exist: "El personaje {character} no existe.",
            embed: {
                title: "Información del personaje",
                description: "Información sobre {character} - [Armería]({url})",
                fields: {
                    character: "Personaje",
                    realm: "Reino",
                    online: "En línea",
                    level: "Nivel",
                    yes: "Sí",
                    no: "No",
                    gender: "Género",
                    race: "Raza",
                    class: "Clase",
                    faction: "Facción",
                    honorable_kills: "Muertes honorables",
                    guild: "Hermandad",
                    achievement_points: "Puntos de logro",
                    talents: "Talentos",
                    no_guild: "Ninguna",
                    pvp_teams: "Equipos PvP",
                    gearscore: "Puntuación de equipo",
                    missing_gems: "Gemas faltantes",
                    missing_enchants: "Encantamientos faltantes",
                    none: "Ninguno",
                    professions: "Profesiones",
                    teams: "Equipos PvP ({type}): {name} (Clasificación: {rating}, Rango: {rank})",
                    belongs_to: "Pertenece a"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "El MD de bienvenida no está habilitado.",
            updated: "El mensaje de bienvenida ha sido actualizado."
        },
        servertime: {
            embed: {
                title: "Hora del servidor",
                description: "La hora actual del servidor es: {time}",
                footer: "Solicitado por: {user}"
            }
        },
        setwelcomechannel: {
            channel_set: "El canal de bienvenida ha sido establecido en {channel}.",
            error: "Error al establecer el canal de bienvenida: {error}"
        },
        help: {
            EMBED: {
                TITLE: "Comandos disponibles",
                DESCRIPTION: "Aquí hay una lista de todos los comandos disponibles y sus descripciones:",
                FOOTER: "Solicitado por {USER_TAG}"
            },
            NO_DESCRIPTION: "No hay descripción disponible",
            BUTTONS: {
                PREVIOUS: "Anterior",
                NEXT: "Siguiente"
            }
        },
        setchar: {
            char_not_exist: "El personaje {character} no existe en Warmane.",
            char_already_assigned: "El personaje {character} ya está asignado a {user}.",
            already_has_main: "{user} ya tiene un personaje principal: {character} ({realm}). Si esto es un error, contacta a un miembro del personal en nuestro [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "{character} ({realm}) ha sido establecido exitosamente como personaje {type} para {user}.",
            success: "{character} ({realm}) ha sido establecido exitosamente como personaje principal para {user}.",
            success_updated: "Personaje principal para {user} actualizado de {oldCharacter} a {character} ({realm})."
        },
        charlist: {
            embed: {
                title: "Personajes de {username}",
                no_characters: "No se encontraron personajes para este usuario.",
                main_character: "**Personaje Principal:**\n{name} - {realm}",
                alt_characters_header: "**Personajes Alternativos:**",
                character_entry: "{name} - {realm}"
            }
        },
        setup: {
            title: "Ajustes del Servidor",
            description: "Configura los ajustes de tu servidor haciendo clic en los botones de abajo. Cada ajuste controla diferentes aspectos de la funcionalidad del bot.",
            no_permission: "Necesitas ser administrador o desarrollador para usar este comando.",
            no_button_permission: "Necesitas ser administrador o desarrollador para usar estos ajustes.",
            different_user: "No puedes interactuar con el menú de ajustes de otra persona. Por favor, usa el comando /settings para abrir el tuyo.",
            save_failed: "Error al actualizar los ajustes. Por favor, inténtalo de nuevo.",
            menu_expired: "El menú de ajustes ha expirado.",
            footer: "Los ajustes se guardarán automáticamente al cambiarlos • La interfaz expira después de 5 minutos",
            features: {
                welcome_message: {
                    name: "👋 Mensaje de Bienvenida",
                    description: "Cuando está activado, el bot enviará un mensaje de bienvenida a los nuevos miembros en el canal de bienvenida configurado."
                },
                char_name_ask: {
                    name: "👤 Preguntar Nombre de Personaje",
                    description: "Cuando está activado, el bot automáticamente enviará un MD a los nuevos miembros preguntando por su nombre de personaje y actualizará su apodo en consecuencia."
                },
                block_list: {
                    name: "🚫 Lista Negra",
                    description: "Cuando está activado, el bot usa la Lista Negra global para banear miembros que están en la lista."
                },
                logging: {
                    name: "📝 Registro",
                    description: "Cuando está activado, el bot registrará eventos importantes que son ejecutados por el bot en relación con tu servidor."
                },
                status: {
                    enabled: "✅ Activado",
                    disabled: "❌ Desactivado",
                    channel: "Canal: {channel}"
                }
            },
            buttons: {
                welcome_message: "Mensaje de Bienvenida",
                char_name_ask: "Preguntar Nombre de Personaje",
                block_list: "Lista Negra",
                logging: "Registro",
                change_language: "Cambiar Idioma",
                select_language: "Seleccionar idioma",
                select_welcome_channel: "Seleccionar canal de bienvenida",
                edit_charname_dm: "Editar DM del nombre"
            },
            select_log_channel: "Seleccionar canal de registro",
            log_channel_set: "✅ Canal de registro establecido en {channel}",
            not_set: "No establecido",
            language_set: "✅ El idioma del servidor se ha establecido en {language}",
            welcome_channel_set: "✅ Canal de bienvenida establecido en {channel}",
            charname_dm_modal: {
                title: "Editar mensaje DM del nombre del personaje",
                message_label: "Mensaje DM",
                message_placeholder: "Ingrese el mensaje para enviar cuando se pregunte por el nombre del personaje..."
            },
            charname_dm_updated: "✅ El mensaje DM del nombre del personaje ha sido actualizado"
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Has sido incluido en la lista negra de la Hermandad. Si crees que esto es un error, por favor contacta al personal de la Hermandad o apela en https://discord.gg/YDqBQU43Ht",
            invalid_response: "Tu respuesta no puede estar vacía o demasiado larga.\nPor favor, proporciona una respuesta válida.",
            name_changed: "Tu nombre ha sido cambiado exitosamente a {nickname} para la Hermandad {guildName}.",
            name_change_failed: "No se pudo cambiar tu nombre: {error}",
            mod_notification: "No se pudo enviar la solicitud de nombre de personaje a {username}. Probablemente tienen los MDs desactivados.",
            welcome_title: "¡Bienvenido a {guildName}!",
            welcome_message: "¡Bienvenido {member} a nuestro servidor!\n\nSi tienes alguna pregunta, no dudes en preguntar en un canal público.",
            log_kicked: "Se expulsó a {username} por estar en la lista negra.",
            log_kick_failed: "No se pudo expulsar a {username}: {error}",
            log_dm_failed: "No se pudo enviar un MD a {username}.",
            log_name_changed: "Se cambió el nombre de {username} a {nickname}.",
            log_name_change_failed: "No se pudo cambiar el nombre de {username} a {nickname}: {error}",
            log_end_message_failed: "No se pudo enviar el mensaje final a {username}: {error}",
            log_interaction_failed: "No se pudo interactuar con {username}: {error}",
            log_mod_notification_failed: "No se pudo enviar la notificación a los moderadores: {error}",
            select_character: "Selecciona uno de tus personajes",
            assigned_chars_found: "He encontrado algunos personajes asignados a tu cuenta. Por favor, selecciona uno para usar como apodo:",
            not_on_list_label: "No está en la lista",
            not_on_list_description: "Ingresar otro nombre de personaje manualmente",
            character_not_found: "No pude encontrar ese personaje. Por favor, inténtalo de nuevo con un nombre de personaje válido."
        }
    },
    logging: {
        dm_sent: {
            title: 'MD Enviado',
            description: 'MD de solicitud de nombre de personaje enviado a {username}'
        },
        member_banned: {
            title: 'Miembro Baneado',
            description: 'Usuario de la lista negra baneado',
            reason_label: 'Razón'
        },
        invite_created: {
            title: 'Invitación Creada',
            description: 'Nueva invitación del servidor creada para desarrolladores de {botName}',
            channel: 'Canal',
            created_by: 'Creado por'
        },
        user_label: 'Usuario',
        user_id: 'ID de Usuario',
        footer: 'Registros del Servidor',
        dm_failed: {
            title: 'MD Fallido',
            description: 'No se pudo enviar MD a {username}',
            error_label: 'Error'
        },
        dm_timeout: {
            title: 'Tiempo de Respuesta MD Agotado',
            description: '{username} no respondió dentro del límite de tiempo'
        },
        nickname_changed: {
            title: 'Apodo Modificado',
            description: 'Apodo de {username} cambiado a {nickname}',
            new_nickname: 'Nuevo Apodo'
        }
    }
}; 