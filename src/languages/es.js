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
            dm_initial: "Hola, me gustaría preguntarte por el nombre de tu personaje principal. Por favor, responde con el nombre de tu personaje principal.",
            empty_response: "Tu respuesta no puede estar vacía. Por favor, proporciona una respuesta válida.",
            nickname_success: "El nombre de tu personaje principal ha sido cambiado exitosamente a {nickname}.",
            nickname_failed: "No se pudo cambiar el nombre de tu personaje principal: {error}"
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
                    pvp_teams: "Equipos JcJ",
                    gearscore: "Puntuación de equipo",
                    missing_gems: "Gemas faltantes",
                    missing_enchants: "Encantamientos faltantes",
                    none: "Ninguno",
                    professions: "Profesiones",
                    teams: "Equipos JcJ ({type}): {name} (Clasificación: {rating}, Rango: {rank})",
                    belongs_to: "Pertenece a"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "El mensaje de bienvenida por MD no está activado.",
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
            channel_set: "El canal de bienvenida se ha establecido en {channel}.",
            error: "No se pudo establecer el canal de bienvenida debido a: {error}"
        },
        help: {
            EMBED: {
                TITLE: "Comandos Disponibles",
                DESCRIPTION: "Aquí hay una lista de todos los comandos disponibles y sus descripciones:",
                FOOTER: "Solicitado por {USER_TAG}"
            },
            NO_DESCRIPTION: "Sin descripción disponible",
            BUTTONS: {
                PREVIOUS: "Anterior",
                NEXT: "Siguiente"
            }
        },
        setchar: {
            char_not_exist: "El personaje {character} no existe en Warmane.",
            char_already_assigned: "El personaje {character} ya está asignado a {user}.",
            already_has_main: "{user} ya tiene un personaje principal: {character} ({realm}). Si esto es un error, contacta a un miembro del staff en nuestro [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "Se ha establecido exitosamente a {character} ({realm}) como personaje {type} para {user}.",
            success: "Se ha establecido exitosamente a {character} ({realm}) como personaje principal para {user}.",
            success_updated: "Personaje principal de {user} actualizado de {oldCharacter} a {character} ({realm})."
        },
        charlist: {
            embed: {
                title: "Personajes de {username}",
                no_characters: "No se encontraron personajes para este usuario.",
                main_character: "**Personaje Principal:**\n{name} - {realm}",
                alt_characters_header: "**Personajes Alternativos:**",
                character_entry: "{name} - {realm}"
            }
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Has sido incluido en la lista negra de la hermandad. Si crees que esto es un error, por favor contacta al personal de la hermandad o apela en https://discord.gg/YDqBQU43Ht",
            invalid_response: "Tu respuesta no puede estar vacía o ser demasiado larga.\nPor favor, proporciona una respuesta válida.",
            name_changed: "Tu nombre ha sido cambiado exitosamente a {nickname} para la hermandad {guildName}.",
            name_change_failed: "No se pudo cambiar tu nombre: {error}",
            timeout: "¡Se acabó el tiempo! Contacta a un miembro del personal del servidor si deseas cambiar tu nombre nuevamente.",
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
            assigned_chars_found: "He encontrado algunos personajes asignados a tu cuenta. Por favor, selecciona uno para usar como apodo:"
        }
    }
}; 