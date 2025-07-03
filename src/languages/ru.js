module.exports = {
    commands: {
        global_strings: {
            no_permission: 'У вас нет необходимых разрешений для использования этой команды.',
            invalid_target: 'Неверная цель!',
            dm_failed: 'Не удалось отправить личное сообщение {username}.',
            dm_sent: 'Личное сообщение отправлено {username}.',
            guild_only: 'Эта команда может использоваться только на сервере.',
            not_in_guild: 'Эта команда может использоваться только на сервере.',
            error_occurred: 'Произошла ошибка: {error}',
            user_not_found: 'Пользователь не найден.',
            bot_developer_only: 'Эта команда доступна только разработчикам бота.'
        },
        charname: {
            dm_initial: 'Привет, я хотел бы спросить имя твоего основного персонажа.\nПожалуйста, ответь именем своего основного персонажа для сервера.\n\nУ тебя есть 10 минут на ответ.',
            empty_response: 'Твой ответ не может быть пустым. Пожалуйста, предоставь действительный ответ.',
            nickname_success: 'Имя твоего основного персонажа успешно изменено на {nickname}.',
            nickname_failed: 'Не удалось изменить имя твоего основного персонажа из-за: {error}',
            dm_timeout_message: 'Время истекло. Пожалуйста, свяжитесь с членом персонала {guildName} для получения нового шанса.'
        },
        globalcheck: {
            no_blacklisted: 'Нет пользователей в черном списке.',
            no_blacklisted_guild: 'Нет пользователей в черном списке в этом сервере.',
            not_for_you: 'Эти кнопки не для вас!',
            embed_title: 'Пользователи в черном списке',
            blacklisted_user: 'ID: <@{userId}>\nПричина: {reason}',
            BUTTONS: {
                KICK: 'Кикнуть',
                BAN: 'Забанить',
                NOTHING: 'Ничего не делать'
            },
            ACTION_RESULTS: {
                KICKED: 'Успешно кикнуто {COUNT} участников',
                BANNED: 'Успешно забанено {COUNT} участников',
                NOTHING: 'Действие не предпринято',
                FAILED: 'Не удалось обработать {COUNT} участников'
            },
            navigation: {
                previous: 'Предыдущая',
                next: 'Следующая'
            }
        },
        report: {
            modal: {
                title: 'Пожаловаться на пользователя',
                username_label: 'Имя пользователя жалобы?',
                username_placeholder: 'Введите имя пользователя/ID discord здесь!',
                reason_label: 'Причина',
                reason_placeholder: 'Введите причину здесь!',
                evidence_label: 'Предоставьте ваши доказательства.',
                evidence_placeholder: 'https://imgur.com/blablabla!'
            },
            submitted: 'Ваша жалоба была отправлена. Спасибо, что помогаете нам поддерживать безопасность сервера.',
            report_title: 'Жалоба на пользователя',
            reported_user: 'Пользователь, на которого пожаловались',
            reason: 'Причина',
            evidence: 'Доказательства',
            reporter_id: 'ID жалобщика',
            submitted_by: 'Жалоба отправлена {user}',
            send_failed: 'Не удалось отправить жалобу в канал модерации.'
        },
        poll: {
            question_missing: 'Отсутствует вопрос опроса.',
            answer_too_long: 'Один из ответов превышает лимит в 55 символов: "{answer}"',
            min_answers: 'Требуется как минимум два ответа.',
            creation_failed: 'Не удалось отправить опрос в канал: {error}',
            created_pinned: 'Ваш опрос был создан и закреплен!',
            created: 'Ваш опрос был создан!'
        },
        charinfo: {
            loading: 'Мы ищем ваши данные. Пожалуйста, подождите.',
            char_not_exist: 'Персонаж {character} не существует.',
            embed: {
                title: 'Информация о персонаже',
                description: 'Информация о {character} - [Арсенал]({url})',
                fields: {
                    character: 'Персонаж',
                    realm: 'Мир',
                    online: 'В сети',
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
                    missing_enchants: 'Отсутствующие зачарования',
                    none: 'Нет',
                    professions: 'Профессии',
                    teams: 'PvP команды ({type}): {name} (Рейтинг: {rating}, Ранг: {rank})',
                    belongs_to: 'Принадлежит к'
                }
            }
        },
        setwelcomemessage: {
            dm_not_enabled: 'Приветственное личное сообщение не включено.',
            updated: 'Приветственное сообщение было обновлено.'
        },
        servertime: {
            embed: {
                title: 'Время сервера',
                description: 'Текущее время сервера: {time}',
                footer: 'Запрошено: {user}'
            },
            error: 'Произошла ошибка при получении времени сервера.'
        },
        setwelcomechannel: {
            channel_set: 'Канал приветствия установлен на {channel}.',
            error: 'Не удалось установить канал приветствия из-за: {error}'
        },
        help: {
            EMBED: {
                TITLE: 'Доступные команды',
                DESCRIPTION: 'Вот список всех доступных команд и их описания:',
                FOOTER: 'Запрошено {USER_TAG}'
            },
            NO_DESCRIPTION: 'Описание недоступно',
            BUTTONS: {
                PREVIOUS: 'Предыдущая',
                NEXT: 'Следующая',
                BACK_TO_OVERVIEW: 'Вернуться к обзору'
            },
            command_not_found: 'Команда не найдена. Используйте `/help` для просмотра всех доступных команд.',
            options: 'Опции команды'
        },
        setchar: {
            char_not_exist: 'Персонаж {character} не существует на Warmane.',
            char_already_assigned: 'Персонаж {character} уже назначен {user}.',
            already_has_main: '{user} уже имеет основного персонажа: {character} ({realm}). Если это ошибка, свяжитесь с членом персонала в нашем [Discord](https://discord.gg/YDqBQU43Ht).',
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
            no_progress: 'Прогресс уровня для этого пользователя не найден.',
            level_up: '🎉 Эй {user} ты достиг уровня {level}! Поздравления! 🎉',
            disabled: 'Система уровней отключена на этом сервере.',
            card_description: 'Изображение карточки уровня'
        },
        setup: {
            title: 'Настройки сервера',
            description: 'Настройте настройки вашего сервера, нажимая кнопки ниже. Каждая настройка контролирует различные аспекты функциональности бота.',
            no_permission: 'Вы должны быть администратором или разработчиком для использования этой команды.',
            no_button_permission: 'Вы должны быть администратором или разработчиком для использования этих настроек.',
            different_user: 'Вы не можете взаимодействовать с меню настроек другого человека. Пожалуйста, используйте команду /settings для открытия своего.',
            save_failed: 'Не удалось обновить настройки. Пожалуйста, попробуйте снова.',
            menu_expired: 'Меню настроек истекло.',
            footer: 'Настройки будут автоматически сохранены при переключении • Интерфейс истекает через 5 минут',
            features: {
                welcome_message: {
                    name: '👋 Приветственное сообщение',
                    description: 'Когда включено, бот будет отправлять приветственное сообщение новым участникам в настроенном канале приветствия.'
                },
                char_name_ask: {
                    name: '👤 Спрашивать имя персонажа',
                    description: 'Когда включено, бот будет автоматически отправлять личные сообщения новым участникам, спрашивая имя их персонажа и обновлять их никнейм соответственно.'
                },
                block_list: {
                    name: '🚫 Черный список',
                    description: 'Когда включено, бот использует глобальный черный список для бана участников, которые находятся в списке.'
                },
                logging: {
                    name: '📝 Логирование',
                    description: 'Когда включено, бот будет логировать важные события, которые выполняются ботом в отношении вашего сервера.'
                },
                language: {
                    name: '🌍 Язык',
                    description: 'Измените язык, который бот использует на вашем сервере.',
                    current: 'Текущий язык: {language}'
                },
                char_name: {
                    name: '👤 Имя персонажа',
                    description: 'Настройте настройки имени персонажа для вашего сервера.'
                },
                status: {
                    enabled: '✅ Включено',
                    disabled: '❌ Отключено',
                    channel: 'Канал: {channel}'
                },
                leveling: {
                    name: '📊 Система уровней',
                    description: 'Настройте систему уровней для вашего сервера.'
                },
                blacklist_words: {
                    name: '🚫 Blacklisted Words',
                    description: 'When enabled, the bot will automatically detect and handle messages containing blacklisted words.'
                }
            },
            buttons: {
                welcome_message: 'Приветственное сообщение',
                char_name_ask: 'Спрашивать имя персонажа',
                block_list: 'Черный список',
                logging: 'Логирование',
                change_language: 'Изменить язык',
                select_language: 'Выбрать язык',
                edit_charname_dm: 'Редактировать ЛС имени персонажа',
                leveling: 'Система уровней',
                blacklist_words: 'Blacklisted Words'
            },
            select_log_channel: 'Выбрать канал логирования',
            select_welcome_channel: 'Выбрать канал приветствия',
            select_leveling_channel: 'Выбрать канал уровней',
            log_channel_set: '✅ Канал логирования установлен на {channel}',
            not_set: 'Не установлено',
            language_set: '✅ Язык сервера установлен на {language}',
            leveling_channel_set: '✅ Канал уровней установлен на {channel}',
            welcome_channel_set: '✅ Канал приветствия установлен на {channel}',
            charname_dm_modal: {
                title: 'Редактировать сообщение ЛС имени персонажа',
                message_label: 'Сообщение ЛС',
                message_placeholder: 'Введите сообщение для отправки при запросе имени персонажа...'
            },
            charname_dm_updated: '✅ Сообщение ЛС имени персонажа было обновлено',
            error_occurred: 'Произошла ошибка: {error}'
        },
        account: {
            embed: {
                description: 'Информация об аккаунте и статистика',
                fields: {
                    account_info_title: '👤 Информация об аккаунте',
                    username: 'Имя пользователя',
                    displayName: 'Отображаемое имя',
                    id: 'ID',
                    created: 'Создан',
                    joined: 'Присоединился к серверу',
                    
                    activity_title: '📊 Статистика активности',
                    accountStanding: 'Статус аккаунта',
                    accountLevel: 'Уровень',
                    accountXP: 'Опыт',
                    xpProgress: 'Прогресс уровня',
                    voiceTime: 'Время в голосовом канале',
                    serverProgress: 'Прогресс сервера',
                    serverLevel: 'Уровень сервера',
                    serverXP: 'Опыт сервера',
                    
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
                footer: 'Информация об аккаунте • {guildName}'
            }
        },
        testcontext: {
            title: 'Тест анализа контекста',
            description: 'Тестовое слово: **{word}**',
            test_message: 'Тестовое сообщение',
            result: 'Результат',
            confidence: 'Уверенность',
            threshold: 'Порог',
            context_around_word: 'Контекст вокруг слова',
            analysis_reasoning: 'Обоснование анализа',
            bot_action: 'Действие бота',
            appropriate_usage: 'Подходящее использование',
            inappropriate_usage: 'Неподходящее использование',
            would_take_action: 'Предпринял бы действие (удалить/предупредить)',
            would_allow_message: 'Разрешил бы сообщение',
            and_more: '...и больше'
        },
        blacklistword: {
            word_already_exists: 'Слово "{word}" уже в черном списке.',
            invalid_pagination_state: 'Неверное состояние пагинации.',
            pagination_error: 'Произошла ошибка при обновлении страницы.',
            word_not_found: 'Слово "{word}" не в черном списке.',
            no_words: 'Нет слов в черном списке для этого сервера.',
            no_global_words: 'Нет глобальных слов в черном списке.',
            added_title: '✅ Слово добавлено в черный список',
            added_description: 'Слово "{word}" было успешно добавлено в черный список.',
            removed_title: '❌ Слово удалено из черного списка',
            removed_description: 'Слово "{word}" было успешно удалено из черного списка.',
            list_title: '📝 Слова в черном списке',
            list_description: 'Вот все слова в черном списке для этого сервера ({count} всего):',
            global_list_title: '🌐 Глобальные слова в черном списке',
            global_list_description: 'Вот все глобальные слова в черном списке ({count} всего):',
            page_info: 'Страница {page} из {totalPages}',
            toggle_title: '🔄 Статус слова обновлен',
            toggle_description: 'Слово "{word}" было {status}.',
            enabled: 'включено',
            disabled: 'отключено',
            previous_page: 'Предыдущая',
            next_page: 'Следующая',
            no_reason: 'Причина не указана',
            fields: {
                word: 'Слово',
                added_by: 'Добавлено',
                removed_by: 'Удалено',
                toggled_by: 'Переключено',
                reason: 'Причина',
                case_sensitive: 'Чувствительно к регистру',
                delete_message: 'Удалить сообщение',
                warn_user: 'Предупредить пользователя',
                context_analysis: 'Анализ контекста',
                context_threshold: 'Порог контекста'
            },
            word_info: '**Добавлено:** {addedBy}\n**Чувствительно к регистру:** {caseSensitive}\n**Удалить сообщение:** {deleteMessage}\n**Предупредить пользователя:** {warnUser}\n**Анализ контекста:** {useContextAnalysis}\n**Порог контекста:** {contextThreshold}\n**Причина:** {reason}'
        }
    },
    events: {
        guildMemberAdd: {
            blacklisted: 'Вы были добавлены в черный список гильдии. Если вы думаете, что это ошибка, пожалуйста, свяжитесь с персоналом гильдии. Или подайте апелляцию на https://discord.gg/YDqBQU43Ht',
            charname_ask: 'Привет, я хотел бы спросить имя твоего основного персонажа.\nПожалуйста, ответь именем своего основного персонажа для сервера.',
            invalid_response: 'Твой ответ не может быть пустым или слишком длинным.\nПожалуйста, предоставь действительный ответ.',
            name_changed: 'Твое имя было успешно изменено на {nickname} для гильдии {guildName}.',
            name_change_failed: 'Не удалось изменить твое имя из-за: {error}',
            mod_notification: 'Не удалось отправить запрос имени персонажа {username}. Вероятно, у них отключены личные сообщения.',
            welcome_title: 'Добро пожаловать в {guildName}!',
            welcome_message: 'Добро пожаловать {member} на наш сервер!\n\nЕсли у вас есть вопросы, не стесняйтесь спрашивать в публичном канале.',
            log_kicked: 'Кикнут {username} за нахождение в черном списке.',
            log_kick_failed: 'Не удалось кикнуть {username} из-за: {error}',
            log_dm_failed: 'Не удалось отправить личное сообщение {username}.',
            log_name_changed: 'Изменено {username} на {nickname}.',
            log_name_change_failed: 'Не удалось изменить {username} на {nickname} из-за: {error}',
            log_end_message_failed: 'Не удалось отправить финальное сообщение {username}: {error}',
            log_interaction_failed: 'Не удалось взаимодействовать с {username}: {error}',
            log_mod_notification_failed: 'Не удалось отправить уведомление модератора: {error}',
            select_character: 'Выберите одного из ваших персонажей',
            assigned_chars_found: 'Я нашел несколько персонажей, назначенных вашему аккаунту. Пожалуйста, выберите одного для использования в качестве вашего никнейма:',
            not_on_list_label: 'Не в списке',
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
        },
        guildCreate: {
            thanks_title: 'Спасибо за добавление меня в {guildName}! 🎉',
            description: 'Вот как начать настройку бота:',
            basic_commands: '📚 Основные команды',
            help_command: '`/help` - Просмотр всех доступных команд',
            essential_setup: '⚙️ Основная настройка',
            setup_command: '`/setup` - Настройка всех функций бота:',
            setup_features: [
                '• Приветственные сообщения и канал',
                '• Система имен персонажей',
                '• Защита черного списка',
                '• Логирование сервера',
                '• Язык бота',
                '• Пользовательские ЛС сообщения'
            ],
            character_management: '👤 Управление персонажами',
            char_commands: [
                '`/set-char` - Назначить персонажа пользователю',
                '`/charname` - Спросить пользователя имя персонажа',
                'Вы также можете щелкнуть правой кнопкой мыши на пользователе и выбрать "Спросить имя персонажа"'
            ],
            need_help: '🔗 Нужна помощь?',
            support_server: '[Присоединяйтесь к нашему серверу поддержки](https://discord.gg/YDqBQU43Ht)',
            footer: 'Приятного использования бота! 🤖'
        }
    },
    logging: {
        error: 'Ошибка',
        footer: 'Логи сервера',
        log_event: 'Событие лога',
        information: 'Информация',
        no_value_provided: 'Значение не предоставлено',
        missing_permissions_notification: 'У меня нет необходимых разрешений для отправки логов в настроенный канал логов. Пожалуйста, убедитесь, что у меня есть следующие разрешения: Просмотр канала, Отправка сообщений и Привязка вложений.',
        server_information: 'Информация о сервере',
        development_logs: 'Логи разработки',
        
        // Direct translations for field keys
        dm: {
            user_label: 'Пользователь',
            user_id: 'ID пользователя',
            error_label: 'Ошибка',
            error: 'Ошибка'
        },
        
        // Member events
        member_banned: {
            title: 'Участник забанен',
            description: 'Забанен пользователь из черного списка',
            reason_label: 'Причина'
        },
        nickname_changed: {
            title: 'Никнейм изменен',
            description: 'Никнейм изменен для {username} на {nickname}',
            new_nickname: 'Новый никнейм'
        },
        
        // DM related logs
        dm_sent: {
            title: 'ЛС отправлено',
            description: 'ЛС запроса имени персонажа отправлено {username}'
        },
        dm_failed: {
            title: 'ЛС не удалось',
            description: 'Не удалось отправить ЛС {username}',
            user_label: 'Пользователь',
            user_id: 'ID пользователя',
            error_label: 'Ошибка',
            response: 'Ответ',
            reason_label: 'Причина'
        },
        dm_timeout: {
            title: 'Тайм-аут ответа ЛС',
            description: '{username} не ответил в пределах временного лимита'
        },
        
        // System events
        invite_created: {
            title: 'Приглашение создано',
            description: 'Создано новое приглашение сервера для разработчиков {botName}',
            channel: 'Канал',
            created_by: 'Создано'
        },
        interaction_failed: {
            title: 'Взаимодействие не удалось',
            description: 'Не удалось взаимодействовать с {username}',
            error_label: 'Ошибка',
            component_label: 'Компонент'
        },
        
        // Leveling system logs
        leveling_progress_removed: {
            title: 'Прогресс уровня удален',
            description: 'Прогресс уровня удален для {username}, {userId}>'
        },
        level_up: {
            title: 'Повышение уровня',
            description: '{username} достиг уровня {level}',
            previous_level: 'Предыдущий уровень',
            current_level: 'Текущий уровень',
            xp_earned: 'Полученный опыт'
        },
        
        // Permission logs
        permission_denied: {
            title: 'Разрешение отказано',
            description: '{username} попытался использовать {command} без соответствующих разрешений',
            required_permissions: 'Требуемые разрешения',
            user_permissions: 'Разрешения пользователя'
        },
        
        // Command usage logs
        command_used: {
            title: 'Команда использована',
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
