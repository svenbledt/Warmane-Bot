module.exports = {
    commands: {
        global_strings: {
            no_permission: "У вас нет необходимых прав для использования этой команды.",
            invalid_target: "Неверная цель!",
            dm_failed: "Не удалось отправить личное сообщение {username}.",
            dm_sent: "Личное сообщение отправлено {username}.",
            guild_only: "Эта команда может использоваться только на сервере.",
            error_occurred: "Произошла ошибка: {error}"
        },
        charname: {
            dm_initial: "Привет, я хотел бы узнать имя твоего основного персонажа.\nПожалуйста, ответь именем своего основного персонажа для сервера.\n\nУ тебя есть 10 минут чтобы ответить.",
            empty_response: "Твой ответ не может быть пустым. Пожалуйста, предоставь действительный ответ.",
            nickname_success: "Имя твоего основного персонажа успешно изменено на {nickname}.",
            nickname_failed: "Не удалось изменить имя твоего основного персонажа: {error}",
            dm_timeout_message: "Время истекло. Пожалуйста, свяжитесь с персоналом {guildName} чтобы получить новый шанс."
        },
        globalcheck: {
            no_blacklisted: "Нет пользователей в черном списке.",
            no_blacklisted_guild: "На сервере нет пользователей из черного списка.",
            not_for_you: "Эти кнопки не для вас!",
            embed_title: "Пользователи в черном списке",
            blacklisted_user: "ID: <@{userId}>\nПричина: {reason}",
            BUTTONS: {
                KICK: "Выгнать",
                BAN: "Забанить",
                NOTHING: "Ничего не делать"
            },
            ACTION_RESULTS: {
                KICKED: "Успешно выгнано {COUNT} участников",
                BANNED: "Успешно забанено {COUNT} участников",
                NOTHING: "Действия не предприняты",
                FAILED: "Не удалось обработать {COUNT} участников"
            }
        },
        report: {
            modal: {
                title: "Пожаловаться на пользователя",
                username_label: "Имя пользователя, на которого жалуетесь?",
                username_placeholder: "Введите имя пользователя/discord id здесь!",
                reason_label: "Причина",
                reason_placeholder: "Укажите причину здесь!",
                evidence_label: "Предоставьте доказательства.",
                evidence_placeholder: "https://imgur.com/blablabla!"
            }
        },
        poll: {
            question_missing: "Отсутствует вопрос опроса.",
            answer_too_long: "Один из ответов превышает лимит в 55 символов: \"{answer}\"",
            min_answers: "Требуется минимум два ответа.",
            creation_failed: "Не удалось создать опрос: {error}",
            created_pinned: "Ваш опрос создан и закреплен!",
            created: "Ваш опрос создан!"
        },
        charinfo: {
            loading: "Мы ищем ваши данные. Пожалуйста, подождите.",
            char_not_exist: "Персонаж {character} не существует.",
            embed: {
                title: "Информация о персонаже",
                description: "Информация о {character} - [Оружейная]({url})",
                fields: {
                    character: "Персонаж",
                    realm: "Реалм",
                    online: "Онлайн",
                    level: "Уровень",
                    yes: "Да",
                    no: "Нет",
                    gender: "Пол",
                    race: "Раса",
                    class: "Класс",
                    faction: "Фракция",
                    honorable_kills: "Почетные убийства",
                    guild: "Гильдия",
                    achievement_points: "Очки достижений",
                    talents: "Таланты",
                    no_guild: "Нет",
                    pvp_teams: "PvP команды",
                    gearscore: "Оценка снаряжения",
                    missing_gems: "Отсутствующие камни",
                    missing_enchants: "Отсутствующие чары",
                    none: "Нет",
                    professions: "Профессии",
                    teams: "PvP команды ({type}): {name} (Рейтинг: {rating}, Ранг: {rank})",
                    belongs_to: "Принадлежит"
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: "Приветственное ЛС не включено.",
            updated: "Приветственное сообщение обновлено."
        },
        servertime: {
            embed: {
                title: "Время сервера",
                description: "Текущее время сервера: {time}",
                footer: "Запрошено пользователем: {user}"
            }
        },
        setwelcomechannel: {
            channel_set: "Канал приветствия установлен на {channel}.",
            error: "Ошибка при установке канала приветствия: {error}"
        },
        help: {
            EMBED: {
                TITLE: "Доступные команды",
                DESCRIPTION: "Вот список всех доступных команд и их описания:",
                FOOTER: "Запрошено пользователем {USER_TAG}"
            },
            NO_DESCRIPTION: "Описание отсутствует",
            BUTTONS: {
                PREVIOUS: "Назад",
                NEXT: "Вперед"
            }
        },
        setchar: {
            char_not_exist: "Персонаж {character} не существует на Warmane.",
            char_already_assigned: "Персонаж {character} уже привязан к {user}.",
            already_has_main: "У {user} уже есть основной персонаж: {character} ({realm}). Если это ошибка, свяжитесь с персоналом в нашем [Discord](https://discord.gg/YDqBQU43Ht).",
            success_with_type: "{character} ({realm}) успешно установлен как {type} персонаж для {user}.",
            success: "{character} ({realm}) успешно установлен как основной персонаж для {user}.",
            success_updated: "Основной персонаж для {user} обновлен с {oldCharacter} на {character} ({realm})."
        },
        charlist: {
            embed: {
                title: "Персонажи {username}",
                no_characters: "Персонажи для этого пользователя не найдены.",
                main_character: "**Основной персонаж:**\n{name} - {realm}",
                alt_characters_header: "**Альтернативные персонажи:**",
                character_entry: "{name} - {realm}"
            }
        },
        level: {
            no_progress: "Вы еще не достигли уровня.",
            level_up: "🎉 Вы достигли уровня {level}! Поздравляем! 🎉"
        },
        setup: {
            title: "Настройки Сервера",
            description: "Настройте параметры вашего сервера, нажимая на кнопки ниже. Каждая настройка управляет различными аспектами функциональности бота.",
            no_permission: "Вы должны быть администратором или разработчиком для использования этой команды.",
            no_button_permission: "Вы должны быть администратором или разработчиком для использования этих настроек.",
            different_user: "Вы не можете взаимодействовать с меню настроек другого пользователя. Пожалуйста, используйте команду /settings, чтобы открыть свое.",
            save_failed: "Не удалось обновить настройки. Пожалуйста, попробуйте снова.",
            menu_expired: "Меню настроек истекло.",
            footer: "Настройки будут автоматически сохранены при переключении • Интерфейс истекает через 5 минут",
            features: {
                welcome_message: {
                    name: "👋 Приветственное Сообщение",
                    description: "Когда включено, бот будет отправлять приветственное сообщение новым участникам в настроенный канал приветствия."
                },
                char_name_ask: {
                    name: "👤 Запрос Имени Персонажа",
                    description: "Когда включено, бот автоматически отправит ЛС новым участникам, запрашивая их имя персонажа и обновит их никнейм соответственно."
                },
                block_list: {
                    name: "🚫 Черный Список",
                    description: "Когда включено, бот использует глобальный Черный список для бана участников, которые находятся в списке."
                },
                logging: {
                    name: "📝 Логирование",
                    description: "Когда включено, бот будет записывать важные события, выполняемые ботом в отношении вашего сервера."
                },
                status: {
                    enabled: "✅ Включено",
                    disabled: "❌ Отключено",
                    channel: "Канал: {channel}"
                },
                language: {
                    name: "🌍 Язык",
                    description: "Измените язык, который бот использует на вашем сервере.",
                    current: "Текущий язык: {language}"
                }
            },
            buttons: {
                welcome_message: "Приветственное Сообщение",
                char_name_ask: "Запрос Имени Персонажа",
                block_list: "Черный Список",
                logging: "Логирование",
                change_language: "Изменить Язык",
                select_language: "Выберите язык",
                edit_charname_dm: "Изменить ЛС имени"
            },
            select_log_channel: "Выберите канал для логов",
            select_welcome_channel: "Выберите канал приветствия",
            log_channel_set: "✅ Канал логирования установлен на {channel}",
            not_set: "Не установлено",
            language_set: "✅ Язык сервера установлен на {language}",
            welcome_channel_set: "✅ Канал приветствия установлен на {channel}",
            charname_dm_modal: {
                title: "Изменить сообщение ЛС для имени персонажа",
                message_label: "Сообщение ЛС",
                message_placeholder: "Введите сообщение, которое будет отправлено при запросе имени персонажа..."
            },
            charname_dm_updated: "✅ Сообщение ЛС для имени персонажа обновлено",
            error_occurred: "Произошла ошибка: {error}"
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: "Вы были занесены в черный список гильдии. Если вы считаете, что это ошибка, пожалуйста, свяжитесь с руководством гильдии или подайте апелляцию на https://discord.gg/YDqBQU43Ht",
            invalid_response: "Ваш ответ не может быть пустым или слишком длинным.\nПожалуйста, предоставьте действительный ответ.",
            name_changed: "Ваше имя успешно изменено на {nickname} для гильдии {guildName}.",
            name_change_failed: "Не удалось изменить ваше имя: {error}",
            timeout: "Время истекло! Свяжитесь с персоналом сервера, если хотите изменить свое имя снова.",
            mod_notification: "Не удалось отправить запрос на имя персонажа пользователю {username}. Вероятно, у них отключены личные сообщения.",
            welcome_title: "Добро пожаловать в {guildName}!",
            welcome_message: "Добро пожаловать {member} на наш сервер!\n\nЕсли у вас есть вопросы, не стесняйтесь задавать их в публичном канале.",
            log_kicked: "Исключен {username} из-за нахождения в черном списке.",
            log_kick_failed: "Не удалось исключить {username}: {error}",
            log_dm_failed: "Не удалось отправить личное сообщение {username}.",
            log_name_changed: "Имя {username} изменено на {nickname}.",
            log_name_change_failed: "Не удалось изменить имя {username} на {nickname}: {error}",
            log_end_message_failed: "Не удалось отправить завершающее сообщение {username}: {error}",
            log_interaction_failed: "Не удалось взаимодействовать с {username}: {error}",
            log_mod_notification_failed: "Не удалось отправить уведомление модератору: {error}",
            select_character: "Выберите одного из ваших персонажей",
            assigned_chars_found: "Я нашел персонажей, привязанных к вашей учетной записи. Пожалуйста, выберите одного для использования в качестве никнейма:",
            not_on_list_label: "Нет в списке",
            not_on_list_description: "Ввести другое имя персонажа вручную",
            character_not_found: "Я не могу найти этого персонажа. Пожалуйста, попробуйте еще раз с действительным именем персонажа."
        }
    },
    logging: {
        error: 'Error',
        leveling_progress_removed: {
            title: 'Leveling Progress Removed',
            description: 'Leveling progress removed for {username}, {userId}>'
        },
        dm_sent: {
            title: 'ЛС Отправлено',
            description: 'Отправлен запрос имени персонажа в ЛС пользователю {username}'
        },
        member_banned: {
            title: 'Участник Заблокирован',
            description: 'Заблокирован пользователь из черного списка',
            reason_label: 'Причина'
        },
        invite_created: {
            title: 'Приглашение Создано',
            description: 'Новое приглашение на сервер создано для разработчиков {botName}',
            channel: 'Канал',
            created_by: 'Создано'
        },
        footer: 'Логи Сервера',
        dm: {
            title: 'Ошибка ЛС',
            description: 'Не удалось отправить ЛС пользователю {username}',
            user_label: 'Пользователь',
            user_id: 'ID Пользователя',
            error_label: 'Ошибка',
            response: 'Ответ',
            reason_label: 'Причина'
        },
        dm_timeout: {
            title: 'Время Ожидания ЛС Истекло',
            description: '{username} не ответил в установленное время'
        },
        nickname_changed: {
            title: 'Никнейм Изменен',
            description: 'Изменен никнейм пользователя {username} на {nickname}',
            new_nickname: 'Новый Никнейм'
        },
        interaction_failed: {
            title: 'Ошибка взаимодействия',
            description: 'Не удалось взаимодействовать с {username}: {error}'
        }
    }
};
