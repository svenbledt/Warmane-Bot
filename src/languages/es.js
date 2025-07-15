module.exports = {
    commands: {
        global_strings: {
            no_permission: 'No tienes los permisos necesarios para usar este comando.',
            invalid_target: '¡Objetivo inválido!',
            dm_failed: 'No se pudo enviar un MD a {username}.',
            dm_sent: 'MD enviado a {username}.',
            guild_only: 'Este comando solo puede ser usado en un servidor.',
            not_in_guild: 'Este comando solo puede ser usado en un servidor.',
            error_occurred: 'Ocurrió un error: {error}',
            user_not_found: 'Usuario no encontrado.',
            bot_developer_only: 'Este comando solo está disponible para desarrolladores del bot.',
            warmane_blocked: 'Los servicios de Warmane han bloqueado esta solicitud. Por favor, inténtalo de nuevo más tarde.'
        },
        charname: {
            dm_initial: 'Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.\n\nTienes 10 minutos para responder.',
            empty_response: 'Tu respuesta no puede estar vacía. Por favor, proporciona una respuesta válida.',
            nickname_success: 'El nombre de tu personaje principal ha sido cambiado exitosamente a {nickname}.',
            nickname_failed: 'No se pudo cambiar el nombre de tu personaje principal debido a: {error}',
            dm_timeout_message: 'Tiempo expirado. Por favor, contacta con un miembro del personal de {guildName} para obtener una nueva oportunidad.',
            warmane_blocked: 'Los servicios de Warmane no están disponibles actualmente. Por favor, inténtalo de nuevo más tarde o contacta con un miembro del personal.'
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
            },
            navigation: {
                previous: 'Anterior',
                next: 'Siguiente'
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
            },
            submitted: 'Tu reporte ha sido enviado. Gracias por ayudarnos a mantener el servidor seguro.',
            report_title: 'Reporte de Usuario',
            reported_user: 'Usuario Reportado',
            reason: 'Razón',
            evidence: 'Evidencia',
            reporter_id: 'ID del Reportero',
            submitted_by: 'Reporte enviado por {user}',
            send_failed: 'No se pudo enviar el reporte al canal de Moderación.'
        },
        poll: {
            question_missing: 'Falta la pregunta de la encuesta.',
            answer_too_long: 'Una de las respuestas excede el límite de 55 caracteres: "{answer}"',
            min_answers: 'Se requieren al menos dos respuestas.',
            creation_failed: 'No se pudo enviar una encuesta al canal: {error}',
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
            },
            error: 'Ocurrió un error al obtener la hora del servidor.'
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
                NEXT: 'Siguiente',
                BACK_TO_OVERVIEW: 'Volver a la Vista General'
            },
            command_not_found: 'Comando no encontrado. Usa `/help` para ver todos los comandos disponibles.',
            options: 'Opciones del Comando'
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
            no_progress: 'No se encontró progreso de nivelación para este usuario.',
            level_up: '🎉 ¡Hey {user} has alcanzado el nivel {level}! ¡Felicidades! 🎉',
            disabled: 'El sistema de nivelación está desactivado en este servidor.',
            card_description: 'Imagen de tarjeta de nivel'
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
            language_set: '✅ Idioma del servidor establecido en {language}',
            leveling_channel_set: '✅ Canal de nivelación establecido en {channel}',
            welcome_channel_set: '✅ Canal de bienvenida establecido en {channel}',
            charname_dm_modal: {
                title: 'Editar Mensaje MD de Nombre de Personaje',
                message_label: 'Mensaje MD',
                message_placeholder: 'Ingresa el mensaje a enviar cuando preguntes por el nombre del personaje...'
            },
            charname_dm_updated: '✅ Mensaje MD de nombre de personaje ha sido actualizado',
            error_occurred: 'Ocurrió un error: {error}'
        },
        account: {
            embed: {
                description: 'Información de cuenta y estadísticas',
                fields: {
                    account_info_title: '👤 Información de Cuenta',
                    username: 'Nombre de Usuario',
                    displayName: 'Nombre de Pantalla',
                    id: 'ID',
                    created: 'Creado',
                    joined: 'Se unió al Servidor',
                    
                    activity_title: '📊 Estadísticas de Actividad',
                    accountStanding: 'Estado de Cuenta',
                    accountLevel: 'Nivel',
                    accountXP: 'Experiencia',
                    xpProgress: 'Progreso de Nivel',
                    voiceTime: 'Tiempo de Voz',
                    serverProgress: 'Progreso del Servidor',
                    serverLevel: 'Nivel del Servidor',
                    serverXP: 'XP del Servidor',
                    
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
        testcontext: {
            title: 'Prueba de Análisis de Contexto',
            description: 'Palabra de prueba: **{word}**',
            test_message: 'Mensaje de Prueba',
            result: 'Resultado',
            confidence: 'Confianza',
            threshold: 'Umbral',
            context_around_word: 'Contexto Alrededor de la Palabra',
            analysis_reasoning: 'Razonamiento de Análisis',
            bot_action: 'Acción del Bot',
            appropriate_usage: 'Uso Apropiado',
            inappropriate_usage: 'Uso Inapropiado',
            would_take_action: 'Tomaría acción (eliminar/advertir)',
            would_allow_message: 'Permitiría el mensaje',
            and_more: '...y más'
        },
        blacklistword: {
            word_already_exists: 'La palabra "{word}" ya está en la lista negra.',
            invalid_pagination_state: 'Estado de paginación inválido.',
            pagination_error: 'Ocurrió un error al actualizar la página.',
            word_not_found: 'La palabra "{word}" no está en la lista negra.',
            no_words: 'No hay palabras en la lista negra para este servidor.',
            no_global_words: 'No hay palabras globales en la lista negra.',
            added_title: '✅ Palabra Agregada a la Lista Negra',
            added_description: 'La palabra "{word}" ha sido agregada exitosamente a la lista negra.',
            removed_title: '❌ Palabra Removida de la Lista Negra',
            removed_description: 'La palabra "{word}" ha sido removida exitosamente de la lista negra.',
            list_title: '📝 Palabras en Lista Negra',
            list_description: 'Aquí están todas las palabras en lista negra para este servidor ({count} total):',
            global_list_title: '🌐 Palabras Globales en Lista Negra',
            global_list_description: 'Aquí están todas las palabras globales en lista negra ({count} total):',
            page_info: 'Página {page} de {totalPages}',
            toggle_title: '🔄 Estado de Palabra Actualizado',
            toggle_description: 'La palabra "{word}" ha sido {status}.',
            enabled: 'habilitada',
            disabled: 'deshabilitada',
            previous_page: 'Anterior',
            next_page: 'Siguiente',
            no_reason: 'Sin razón proporcionada',
            fields: {
                word: 'Palabra',
                added_by: 'Agregado Por',
                removed_by: 'Removido Por',
                toggled_by: 'Cambiado Por',
                reason: 'Razón',
                case_sensitive: 'Sensible a Mayúsculas',
                delete_message: 'Eliminar Mensaje',
                warn_user: 'Advertir Usuario',
                context_analysis: 'Análisis de Contexto',
                context_threshold: 'Umbral de Contexto'
            },
            word_info: '**Agregado por:** {addedBy}\n**Sensible a Mayúsculas:** {caseSensitive}\n**Eliminar Mensaje:** {deleteMessage}\n**Advertir Usuario:** {warnUser}\n**Análisis de Contexto:** {useContextAnalysis}\n**Umbral de Contexto:** {contextThreshold}\n**Razón:** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Has sido agregado a la lista negra de la Hermandad. Si crees que esto es un error, por favor contacta al personal de la Hermandad. O apela en https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Hola, me gustaría preguntarte por el nombre de tu personaje principal.\nPor favor, responde con el nombre de tu personaje principal para el servidor.',
            invalid_response: 'Tu respuesta no puede estar vacía o ser demasiado larga.\nPor favor, proporciona una respuesta válida.',
            name_changed: 'Tu nombre ha sido cambiado exitosamente a {nickname} para la Hermandad {guildName}.',
            name_change_failed: 'No se pudo cambiar tu nombre debido a: {error}',
            mod_notification: 'No se pudo enviar la solicitud de nombre de personaje a {username}. Probablemente tienen los MD deshabilitados.',
            welcome_title: '¡Bienvenido a {guildName}!',
            welcome_message: '¡Bienvenido {member} a nuestro servidor!\n\nSi tienes alguna pregunta, no dudes en preguntar en un canal público.',
            log_kicked: 'Expulsado {username} por estar en la lista negra.',
            log_kick_failed: 'No se pudo expulsar a {username} debido a: {error}',
            log_dm_failed: 'No se pudo enviar un MD a {username}.',
            log_name_changed: 'Cambiado {username} a {nickname}.',
            log_name_change_failed: 'No se pudo cambiar {username} a {nickname} debido a: {error}',
            log_end_message_failed: 'No se pudo enviar mensaje final a {username}: {error}',
            log_interaction_failed: 'No se pudo interactuar con {username}: {error}',
            log_mod_notification_failed: 'No se pudo enviar notificación de moderador: {error}',
            select_character: 'Selecciona uno de tus personajes',
            assigned_chars_found: 'Encontré algunos personajes asignados a tu cuenta. Por favor, selecciona uno para usar como tu apodo:',
            not_on_list_label: 'No en la lista',
            not_on_list_description: 'Ingresa un nombre de personaje diferente manualmente',
            character_not_found: 'No pude encontrar ese personaje. Por favor, inténtalo de nuevo con un nombre de personaje válido.'
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
            thanks_title: '¡Gracias por agregarme a {guildName}! 🎉',
            description: 'Así es como puedes comenzar a configurar el bot:',
            basic_commands: '📚 Comandos Básicos',
            help_command: '`/help` - Ver todos los comandos disponibles',
            essential_setup: '⚙️ Configuración Esencial',
            setup_command: '`/setup` - Configurar todas las funciones del bot:',
            setup_features: [
                '• Mensajes de Bienvenida y Canal',
                '• Sistema de Nombres de Personaje',
                '• Protección de Lista de Bloqueo',
                '• Registro del Servidor',
                '• Idioma del Bot',
                '• Mensajes MD Personalizados'
            ],
            character_management: '👤 Gestión de Personajes',
            char_commands: [
                '`/set-char` - Asignar un personaje a un usuario',
                '`/charname` - Preguntar a un usuario por su nombre de personaje',
                'También puedes hacer clic derecho en un usuario y seleccionar "Preguntar por Charname"'
            ],
            need_help: '🔗 ¿Necesitas Ayuda?',
            support_server: '[Únete a nuestro Servidor de Soporte](https://discord.gg/YDqBQU43Ht)',
            footer: '¡Diviértete usando el bot! 🤖'
        }
    },
    logging: {
        error: 'Error',
        footer: 'Logs del Servidor',
        log_event: 'Evento de Log',
        information: 'Información',
        no_value_provided: 'No se proporcionó valor',
        missing_permissions_notification: 'No tengo los permisos necesarios para enviar logs en el canal de log configurado. Por favor, asegúrate de que tengo los siguientes permisos: Ver Canal, Enviar Mensajes y Vincular Incrustaciones.',
        server_information: 'Información del Servidor',
        development_logs: 'Logs de Desarrollo',
        
        // Direct translations for field keys
        dm: {
            user_label: 'Usuario',
            user_id: 'ID de Usuario',
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
            new_nickname: 'Nuevo Apodo'
        },
        
        // DM related logs
        dm_sent: {
            title: 'MD Enviado',
            description: 'MD de solicitud de nombre de personaje enviado a {username}'
        },
        dm_failed: {
            title: 'MD Fallido',
            description: 'No se pudo enviar MD a {username}',
            user_label: 'Usuario',
            user_id: 'ID de Usuario',
            error_label: 'Error',
            response: 'Respuesta',
            reason_label: 'Razón'
        },
        dm_timeout: {
            title: 'Tiempo de Espera de Respuesta MD',
            description: '{username} no respondió dentro del límite de tiempo'
        },
        
        // System events
        invite_created: {
            title: 'Invitación Creada',
            description: 'Nueva invitación de servidor creada para Desarrolladores de {botName}',
            channel: 'Canal',
            created_by: 'Creado Por'
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
            previous_level: 'Nivel Anterior',
            current_level: 'Nivel Actual',
            xp_earned: 'XP Ganada'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Permiso Denegado',
            description: '{username} intentó usar {command} sin los permisos adecuados',
            required_permissions: 'Permisos Requeridos',
            user_permissions: 'Permisos de Usuario'
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