module.exports = {
    commands: {
        charname: {
            no_permission: "No tienes los permisos necesarios para usar este comando.",
            invalid_target: "¡Objetivo inválido!",
            dm_initial: "Hola, me gustaría preguntarte por el nombre de tu personaje principal. Por favor, responde con el nombre de tu personaje principal.",
            dm_failed: "No se pudo enviar un MD a {username}.",
            dm_sent: "Le he preguntado al usuario por el nombre de su personaje.",
            empty_response: "Tu respuesta no puede estar vacía. Por favor, proporciona una respuesta válida.",
            nickname_success: "El nombre de tu personaje principal ha sido cambiado exitosamente a {nickname}.",
            nickname_failed: "No se pudo cambiar el nombre de tu personaje principal debido a: {error}"
        },
        language: {
            no_permission: "No tienes los permisos necesarios para usar este comando.",
            success: "✅ El idioma del servidor se ha establecido en {language}."
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Has sido incluido en la lista negra de la guild. Si crees que esto es un error, contacta con el personal de la guild o apela en https://discord.gg/YDqBQU43Ht",
            charname_ask: "Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.\n\n(Tu respuesta no será almacenada por esta aplicación y solo se usa para el apodo en la guild)",
            invalid_response: "Tu respuesta no puede estar vacía o ser demasiado larga.\nPor favor, proporciona una respuesta válida.",
            name_changed: "Tu nombre ha sido cambiado exitosamente a {nickname} para la guild {guildName}.",
            name_change_failed: "No se pudo cambiar tu nombre: {error}",
            timeout: "¡Se acabó el tiempo! Contacta con un administrador del servidor si deseas cambiar tu nombre nuevamente.",
            mod_notification: "No se pudo enviar la solicitud de nombre de personaje a {username}. Probablemente tienen los MDs desactivados.",
            welcome_title: "¡Bienvenido a {guildName}!",
            welcome_message: "¡Bienvenido {member} a nuestro servidor!\n\nSi tienes alguna pregunta, no dudes en hacerla en un canal público."
        }
    }
}; 