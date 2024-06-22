const config = {
    database: {
        path: "./database.yml", // The database path.
    },
    base: {
        iconAlliance: "https://i.imgur.com/SDoVQmV.png", // The Alliance icon.
        iconHorde: "https://i.imgur.com/ap8Nran.png", // The Horde icon.
        humanMale: "https://i.imgur.com/70Fa4LF.png", // The Human
        humanFemale: "https://i.imgur.com/uc1fAcR.png", // The Human
        orcMale: "https://i.imgur.com/Yd15jZE.png", // The Orc
        orcFemale: "https://i.imgur.com/ooWSzKw.png", // The Orc
        dwarfMale: "https://i.imgur.com/IrPIiGr.png", // The Dwarf
        dwarfFemale: "https://i.imgur.com/6PyAAf9.png", // The Dwarf
        nightElfMale: "https://i.imgur.com/tsQBM10.png", // The Night Elf
        nightElfFemale: "https://i.imgur.com/xfD8Qt4.png", // The Night Elf
        undeadMale: "https://i.imgur.com/MYT2vmD.png", // The Undead
        undeadFemale: "https://i.imgur.com/pXfY1mc.png", // The Undead
        taurenMale: "https://i.imgur.com/j5aZZWY.png", // The Tauren
        taurenFemale: "https://i.imgur.com/vd2h3pZ.png", // The Tauren
        gnomeMale: "https://i.imgur.com/Pe4iNgu.png", // The Gnome
        gnomeFemale: "https://i.imgur.com/C6lybzM.png", // The Gnome
        trollMale: "https://i.imgur.com/dzdx2R2.png", // The Troll
        trollFemale: "https://i.imgur.com/Ay3xgX4.png", // The Troll
        bloodElfMale: "https://i.imgur.com/efv7ZBN.png", // The Blood Elf
        bloodElfFemale: "https://i.imgur.com/mwwUcgP.png", // The Blood Elf
        draeneiMale: "https://i.imgur.com/LXidUlc.png", // The Draenei
        draeneiFemale: "https://i.imgur.com/isDVJYZ.png", // The Draenei
    },
    development: {
        enabled: true, // If true, the bot will register all application commands to a specific guild (not globally).
        guildId: "1121534671667339324",
        reportChannel: "1241923872270581760",
    },
    commands: {
        prefix: "?", // For message commands, prefix is required. This can be changed by a database.
        message_commands: true, // If true, the bot will allow users to use message (or prefix) commands.
        application_commands: {
            chat_input: true, // If true, the bot will allow users to use chat input (or slash) commands.
            user_context: true, // If true, the bot will allow users to use user context menu commands.
            message_context: true, // If true, the bot will allow users to use message context menu commands.
        },
    },
    users: {
        ownerId: "209319089930240004", // The bot owner ID, which is you.
        developers: [
            "209319089930240004",
            "766356454281183304",
            "277488011241979904",
        ], // The bot developers, remember to include your account ID with the other account IDs.
        url: "https://armory.warmane.com/api/character/", // The character URL for the API.
    },
    messages: {
        // Messages configuration for application commands and message commands handler.
        NOT_BOT_OWNER:
            "You do not have the permission to run this command because you're not the owner of me!",
        NOT_BOT_DEVELOPER:
            "You do not have the permission to run this command because you're not a developer of me!",
        NOT_GUILD_OWNER:
            "You do not have the permission to run this command because you\re not the guild owner!",
        CHANNEL_NOT_NSFW: "You cannot run this command in a non-NSFW channel!",
        MISSING_PERMISSIONS:
            "You do not have the permission to run this command, missing permissions.",
        COMPONENT_NOT_PUBLIC: "You are not the author of this button!",
        GUILD_COOLDOWN:
            "You are currently in cooldown, you have the ability to re-use this command again in `%cooldown%s`.",
    },
};

module.exports = config;
