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
            dm_initial: "Привет, я хотел бы узнать имя твоего основного персонажа. Пожалуйста, ответь именем своего основного персонажа.",
            empty_response: "Ответ не может быть пустым. Пожалуйста, предоставьте действительный ответ.",
            nickname_success: "Имя вашего основного персонажа успешно изменено на {nickname}.",
            nickname_failed: "Не удалось изменить имя вашего основного персонажа: {error}"
        },
        language: {
            success: "✅ Язык сервера установлен на {language}."
        },
        globalcheck: {
            no_blacklisted: "Нет пользователей в черном списке.",
            no_blacklisted_guild: "На сервере нет пользователей из черного списка.",
            not_for_you: "Эти кнопки не для вас!",
            embed_title: "Пользователи в черном списке",
            blacklisted_user: "ID: <@{userId}>\nПричина: {reason}"
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
                    realm: "Игровой мир",
                    online: "В сети",
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
                    gearscore: "Оценка экипировки",
                    missing_gems: "Отсутствующие камни",
                    missing_enchants: "Отсутствующие чары",
                    none: "Нет",
                    professions: "Профессии",
                    teams: "PvP команды ({type}): {name} (Рейтинг: {rating}, Ранг: {rank})"
                }
            }
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
            log_mod_notification_failed: "Не удалось отправить уведомление модератору: {error}"
        }
    }
};
