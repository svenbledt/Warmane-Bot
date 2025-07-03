module.exports = {
    commands: {
        global_strings: {
            no_permission: 'У вас нет необходимых прав для использования этой команды.',
            invalid_target: 'Неверная цель!',
            dm_failed: 'Не удалось отправить личное сообщение {username}.',
            dm_sent: 'Личное сообщение отправлено {username}.',
            guild_only: 'Эта команда может использоваться только на сервере.',
            error_occurred: 'Произошла ошибка: {error}',
            user_not_found: 'Пользователь не найден.',
            bot_developer_only: 'Только разработчики бота могут выполнять это действие.'
        },
        charname: {
            dm_initial: 'Привет, я хотел бы узнать имя твоего основного персонажа.\nПожалуйста, ответь именем своего основного персонажа для сервера.\n\nУ тебя есть 10 минут чтобы ответить.',
            empty_response: 'Твой ответ не может быть пустым. Пожалуйста, предоставь действительный ответ.',
            nickname_success: 'Имя твоего основного персонажа успешно изменено на {nickname}.',
            nickname_failed: 'Не удалось изменить имя твоего основного персонажа: {error}',
            dm_timeout_message: 'Время истекло. Пожалуйста, свяжитесь с персоналом {guildName} чтобы получить новый шанс.'
        },
        globalcheck: {
            no_blacklisted: 'Нет пользователей в черном списке.',
            no_blacklisted_guild: 'На сервере нет пользователей из черного списка.',
            not_for_you: 'Эти кнопки не для вас!',
            embed_title: 'Пользователи в черном списке',
            blacklisted_user: 'ID: <@{userId}>\nПричина: {reason}',
            BUTTONS: {
                KICK: 'Выгнать',
                BAN: 'Забанить',
                NOTHING: 'Ничего не делать'
            },
            ACTION_RESULTS: {
                KICKED: 'Успешно выгнано {COUNT} участников',
                BANNED: 'Успешно забанено {COUNT} участников',
                NOTHING: 'Действия не предприняты',
                FAILED: 'Не удалось обработать {COUNT} участников'
            }
        },
        report: {
            modal: {
                title: 'Пожаловаться на пользователя',
                username_label: 'Имя пользователя, на которого жалуетесь?',
                username_placeholder: 'Введите имя пользователя/discord id здесь!',
                reason_label: 'Причина',
                reason_placeholder: 'Укажите причину здесь!',
                evidence_label: 'Предоставьте доказательства.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            }
        },
        poll: {
            question_missing: 'Отсутствует вопрос опроса.',
            answer_too_long: 'Один из ответов превышает лимит в 55 символов: "{answer}"',
            min_answers: 'Требуется минимум два ответа.',
            creation_failed: 'Не удалось создать опрос: {error}',
            created_pinned: 'Ваш опрос создан и закреплен!',
            created: 'Ваш опрос создан!'
        },
        charinfo: {
            loading: 'Мы ищем ваши данные. Пожалуйста, подождите.',
            char_not_exist: 'Персонаж {character} не существует.',
            embed: {
                title: 'Информация о персонаже',
                description: 'Информация о {character} - [Оружейная]({url})',
                fields: {
                    character: 'Персонаж',
                    realm: 'Реалм',
                    online: 'Онлайн',
                    level: 'Уровень',
                    yes: 'Да',
                    no: 'Нет',
                    gender: 'Пол',
                    race: 'Раса',
                    class: 'Класс',
                    faction: 'Фракция',
                    honorable_kills: 'Почетные убийства',
                    guild: 'Гильдия',
                    achievement_points: 'Очки достижений',
                    talents: 'Таланты',
                    no_guild: 'Нет',
                    pvp_teams: 'PvP команды',
                    gearscore: 'Оценка снаряжения',
                    missing_gems: 'Отсутствующие камни',
                    missing_enchants: 'Отсутствующие чары',
                    none: 'Нет',
                    professions: 'Профессии',
                    teams: 'PvP команды ({type}): {name} (Рейтинг: {rating}, Ранг: {rank})',
                    belongs_to: 'Принадлежит'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'Приветственное ЛС не включено.',
            updated: 'Приветственное сообщение обновлено.'
        },
        servertime: {
            embed: {
                title: 'Время сервера',
                description: 'Текущее время сервера: {time}',
                footer: 'Запрошено пользователем: {user}'
            }
        },
        setwelcomechannel: {
            channel_set: 'Канал приветствия установлен на {channel}.',
            error: 'Ошибка при установке канала приветствия: {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Доступные команды',
                DESCRIPTION: 'Вот список всех доступных команд и их описания:',
                FOOTER: 'Запрошено пользователем {USER_TAG}'
            },
            NO_DESCRIPTION: 'Описание отсутствует',
            BUTTONS: {
                PREVIOUS: 'Назад',
                NEXT: 'Вперед'
            }
        },
        setchar: {
            char_not_exist: 'Персонаж {character} не существует на Warmane.',
            char_already_assigned: 'Персонаж {character} уже привязан к {user}.',
            already_has_main: 'У {user} уже есть основной персонаж: {character} ({realm}). Если это ошибка, свяжитесь с персоналом в нашем [Discord](https://discord.gg/YDqBQU43Ht).',
            success_with_type: '{character} ({realm}) успешно установлен как {type} персонаж для {user}.',
            success: '{character} ({realm}) успешно установлен как основной персонаж для {user}.',
            success_updated: 'Основной персонаж для {user} обновлен с {oldCharacter} на {character} ({realm}).'
        },
        charlist: {
            embed: {
                title: 'Персонажи {username}',
                no_characters: 'Персонажи для этого пользователя не найдены.',
                main_character: '**Основной персонаж:**\n{name} - {realm}',
                alt_characters_header: '**Альтернативные персонажи:**',
                character_entry: '{name} - {realm}'
            }
        },
        level: {
            no_progress: 'Вы еще не достигли уровня.',
            level_up: '🎉 Hey {user} вы достигли уровня {level}! Поздравляем! 🎉',
            disabled: 'Система уровней отключена на этом сервере.'
        },
        setup: {
            title: 'Настройки Сервера',
            description: 'Настройте параметры вашего сервера, нажимая на кнопки ниже. Каждая настройка управляет различными аспектами функциональности бота.',
            no_permission: 'Вы должны быть администратором или разработчиком для использования этой команды.',
            no_button_permission: 'Вы должны быть администратором или разработчиком для использования этих настроек.',
            different_user: 'Вы не можете взаимодействовать с меню настроек другого пользователя. Пожалуйста, используйте команду /settings, чтобы открыть свое.',
            save_failed: 'Не удалось обновить настройки. Пожалуйста, попробуйте снова.',
            menu_expired: 'Меню настроек истекло.',
            footer: 'Настройки будут автоматически сохранены при переключении • Интерфейс истекает через 5 минут',
            features: {
                welcome_message: {
                    name: '👋 Приветственное Сообщение',
                    description: 'Когда включено, бот будет отправлять приветственное сообщение новым участникам в настроенный канал приветствия.'
                },
                char_name_ask: {
                    name: '👤 Запрос Имени Персонажа',
                    description: 'Когда включено, бот автоматически отправит ЛС новым участникам, запрашивая их имя персонажа и обновит их никнейм соответственно.'
                },
                block_list: {
                    name: '🚫 Черный Список',
                    description: 'Когда включено, бот использует глобальный Черный список для бана участников, которые находятся в списке.'
                },
                logging: {
                    name: '📝 Логирование',
                    description: 'Когда включено, бот будет записывать важные события, выполняемые ботом в отношении вашего сервера.'
                },
                language: {
                    name: '🌍 Язык',
                    description: 'Измените язык, который бот использует на вашем сервере.',
                    current: 'Текущий язык: {language}'
                },
                char_name: {
                    name: '👤 Имя Персонажа',
                    description: 'Настройте параметры имени персонажа для вашего сервера.'
                },
                status: {
                    enabled: '✅ Включено',
                    disabled: '❌ Отключено',
                    channel: 'Канал: {channel}'
                },
                leveling: {
                    name: '📊 Система Уровней',
                    description: 'Настройте систему уровней для вашего сервера.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Приветственное Сообщение',
                char_name_ask: 'Запрос Имени Персонажа',
                block_list: 'Черный Список',
                logging: 'Логирование',
                change_language: 'Изменить Язык',
                select_language: 'Выберите язык',
                edit_charname_dm: 'Изменить ЛС имени',
                leveling: 'Система Уровней',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Выберите канал для логов',
            select_welcome_channel: 'Выберите канал приветствия',
            select_leveling_channel: 'Выберите канал уровней',
            log_channel_set: '✅ Канал логирования установлен на {channel}',
            not_set: 'Не установлено',
            language_set: '✅ Язык сервера установлен на {language}',
            leveling_channel_set: '✅ Канал уровней установлен на {channel}',
            welcome_channel_set: '✅ Канал приветствия установлен на {channel}',
            charname_dm_modal: {
                title: 'Изменить сообщение ЛС для имени персонажа',
                message_label: 'Сообщение ЛС',
                message_placeholder: 'Введите сообщение для отправки при запросе имени персонажа...'
            },
            charname_dm_updated: '✅ Сообщение ЛС имени персонажа обновлено',
            error_occurred: 'Произошла ошибка: {error}'
        },
        account: {
            embed: {
                description: 'Информация об аккаунте и статистика',
                fields: {
                    account_info_title: '👤 Информация об Аккаунте',
                    username: 'Имя пользователя',
                    displayName: 'Отображаемое имя',
                    id: 'ID',
                    created: 'Создан',
                    joined: 'Присоединился к серверу',
                    
                    activity_title: '📊 Статистика Активности',
                    accountStanding: 'Статус аккаунта',
                    accountLevel: 'Уровень',
                    accountXP: 'Опыт',
                    xpProgress: 'Прогресс уровня',
                    voiceTime: 'Время в голосовом канале',
                    serverProgress: 'Прогресс сервера',
                    serverLevel: 'Уровень сервера',
                    serverXP: 'XP сервера',
                    
                    roles_title: '🎭 Роли [{count}]',
                    badges_title: '🏅 Значки',
                    
                    tiers: {
                        veteran: '🔱 Артефакт',
                        diamond: '💎 Легендарный',
                        gold: '🥇 Эпический',
                        silver: '🥈 Редкий',
                        bronze: '🥉 Обычный'
                    }
                },
                footer: 'Информация об Аккаунте • {guildName}'
            }
        },
        blacklistword: {
            word_already_exists: 'Слово "{word}" уже в черном списке.',
            word_not_found: 'Слово "{word}" не найдено в черном списке.',
            no_words: 'В черном списке для этого сервера нет слов.',
            added_title: '✅ Слово добавлено в черный список',
            added_description: 'Слово "{word}" успешно добавлено в черный список.',
            removed_title: '❌ Слово удалено из черного списка',
            removed_description: 'Слово "{word}" успешно удалено из черного списка.',
            list_title: '📝 Слова в черном списке',
            list_description: 'Вот все слова в черном списке для этого сервера ({count} всего):',
            page_info: 'Страница {page} из {totalPages}',
            toggle_title: '🔄 Статус слова обновлен',
            toggle_description: 'Слово "{word}" было {status}.',
            enabled: 'включено',
            disabled: 'отключено',
            previous_page: 'Назад',
            next_page: 'Вперед',
            no_reason: 'Причина не указана',
            fields: {
                word: 'Слово',
                added_by: 'Добавлено',
                removed_by: 'Удалено',
                toggled_by: 'Переключено',
                reason: 'Причина',
                case_sensitive: 'Регистрозависимое',
                delete_message: 'Удалить сообщение',
                warn_user: 'Предупредить пользователя',
                context_analysis: 'Анализ контекста',
                context_threshold: 'Порог контекста'
            },
            word_info: '**Добавлено:** {addedBy}\n**Регистрозависимое:** {caseSensitive}\n**Удалить сообщение:** {deleteMessage}\n**Предупредить пользователя:** {warnUser}\n**Анализ контекста:** {useContextAnalysis}\n**Порог контекста:** {contextThreshold}\n**Причина:** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Вы были добавлены в черный список гильдии. Если вы считаете, что это ошибка, пожалуйста, свяжитесь с персоналом гильдии или подайте апелляцию на https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Привет, я хотел бы узнать имя твоего основного персонажа.\nПожалуйста, ответь именем своего основного персонажа для сервера.',
            invalid_response: 'Твой ответ не может быть пустым или слишком длинным.\nПожалуйста, предоставь действительный ответ.',
            name_changed: 'Твое имя успешно изменено на {nickname} для гильдии {guildName}.',
            name_change_failed: 'Не удалось изменить твое имя: {error}',
            mod_notification: 'Не удалось отправить запрос имени персонажа {username}. Вероятно, у них отключены личные сообщения.',
            welcome_title: 'Добро пожаловать в {guildName}!',
            welcome_message: 'Добро пожаловать {member} на наш сервер!\n\nЕсли у вас есть вопросы, не стесняйтесь спрашивать в публичном канале.',
            log_kicked: 'Выгнан {username} за нахождение в черном списке.',
            log_kick_failed: 'Не удалось выгнать {username}: {error}',
            log_dm_failed: 'Не удалось отправить ЛС {username}.',
            log_name_changed: 'Имя {username} изменено на {nickname}.',
            log_name_change_failed: 'Не удалось изменить имя {username} на {nickname}: {error}',
            log_end_message_failed: 'Не удалось отправить финальное сообщение {username}: {error}',
            log_interaction_failed: 'Не удалось взаимодействовать с {username}: {error}',
            log_mod_notification_failed: 'Не удалось отправить уведомление модератору: {error}',
            select_character: 'Выберите одного из ваших персонажей',
            assigned_chars_found: 'Я нашел несколько персонажей, назначенных вашему аккаунту. Пожалуйста, выберите одного для использования в качестве никнейма:',
            not_on_list_label: 'Нет в списке',
            not_on_list_description: 'Введите другое имя персонажа вручную',
            character_not_found: 'Я не смог найти этого персонажа. Пожалуйста, попробуйте снова с действительным именем персонажа.'
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
            user_label: 'Пользователь',
            user_id: 'ID пользователя',
            error_label: 'Ошибка',
            error: 'Ошибка'
        },
        
        // Member events
        member_banned: {
            title: 'Участник Забанен',
            description: 'Пользователь из черного списка забанен',
            reason_label: 'Причина'
        },
        nickname_changed: {
            title: 'Никнейм Изменен',
            description: 'Никнейм изменен для {username} на {nickname}',
            new_nickname: 'Новый никнейм'
        },
        
        // DM related logs
        dm_sent: {
            title: 'ЛС Отправлено',
            description: 'Запрос имени персонажа ЛС отправлено {username}'
        },
        dm_failed: {
            title: 'ЛС Не Удалось',
            description: 'Не удалось отправить ЛС {username}',
            user_label: 'Пользователь',
            user_id: 'ID пользователя',
            error_label: 'Ошибка',
            response: 'Ответ',
            reason_label: 'Причина'
        },
        dm_timeout: {
            title: 'Таймаут Ответа ЛС',
            description: '{username} не ответил в течение временного лимита'
        },
        
        // System events
        invite_created: {
            title: 'Приглашение Создано',
            description: 'Новое приглашение сервера создано для разработчиков {botName}',
            channel: 'Канал',
            created_by: 'Создано'
        },
        interaction_failed: {
            title: 'Взаимодействие Не Удалось',
            description: 'Не удалось взаимодействовать с {username}',
            error_label: 'Ошибка',
            component_label: 'Компонент'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Прогресс Уровней Удален',
            description: 'Прогресс уровней удален для {username}, {userId}>'
        },
        level_up: {
            title: 'Повышение Уровня',
            description: '{username} достиг уровня {level}',
            previous_level: 'Предыдущий уровень',
            current_level: 'Текущий уровень',
            xp_earned: 'Получено XP'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Разрешение Отклонено',
            description: '{username} попытался использовать {command} без соответствующих разрешений',
            required_permissions: 'Требуемые разрешения',
            user_permissions: 'Разрешения пользователя'
        },
        
        // Command usage logs
        command_used: {
            title: 'Команда Использована',
            description: '{username} использовал {command}',
            channel: 'Канал',
            options: 'Опции'
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
