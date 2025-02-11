const config = {
    base: {
        iconAlliance: './assets/races/alliance.png', // The Alliance icon.
        iconHorde: './assets/races/horde.png', // The Horde icon.
        humanMale: './assets/races/human_male.png', // The Human
        humanFemale: './assets/races/human_female.png', // The Human
        orcMale: './assets/races/orc_male.png', // The Orc
        orcFemale: './assets/races/orc_female.png', // The Orc
        dwarfMale: './assets/races/dwarf_male.png', // The Dwarf
        dwarfFemale: './assets/races/dwarf_female.png', // The Dwarf
        nightElfMale: './assets/races/nightelf_male.png', // The Night Elf
        nightElfFemale: './assets/races/nightelf_female.png', // The Night Elf
        undeadMale: './assets/races/undead_male.png', // The Undead
        undeadFemale: './assets/races/undead_female.png', // The Undead
        taurenMale: './assets/races/tauren_male.png', // The Tauren
        taurenFemale: './assets/races/tauren_female.png', // The Tauren
        gnomeMale: './assets/races/gnome_male.png', // The Gnome
        gnomeFemale: './assets/races/gnome_female.png', // The Gnome
        trollMale: './assets/races/troll_male.png', // The Troll
        trollFemale: './assets/races/troll_female.png', // The Troll
        bloodElfMale: './assets/races/bloodelf_male.png', // The Blood Elf
        bloodElfFemale: './assets/races/bloodelf_female.png', // The Blood Elf
        draeneiMale: './assets/races/draenei_male.png', // The Draenei
        draeneiFemale: './assets/races/draenei_female.png', // The Draenei
    },
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildId: '1254444159985651712',
        reportChannel: '1257409168265187428',
        inviteChannel: '1257459204948627638',
        announcementChannel: '1257409143724310609',
        staffAnnouncementChannel: '1257409165769314435',
        logChannel: '1333610717630300210',
    },
    commands: {
        application_commands: {
            chat_input: true, // If true, the bot will allow users to use chat input (or slash) commands.
            user_context: true, // If true, the bot will allow users to use user context menu commands.
            message_context: true, // If true, the bot will allow users to use message context menu commands.
        },
    },
    users: {
        ownerId: '209319089930240004', // The bot owner ID, which is you.
        developers: ['209319089930240004', '992028601308422326'], // The bot developers, remember to include your account ID with the other account IDs.
        url: 'https://armory.warmane.com/', // The character URL for the API.
    },
    messages: {
        // Messages configuration for application commands and message commands handler.
        NOT_BOT_OWNER:
    'You do not have the permission to run this command because you\'re not the owner of me!',
        NOT_BOT_DEVELOPER:
    'This function is limited to Staff only! Please contact a Staff member if you need this function.',
        NOT_GUILD_OWNER:
    'You do not have the permission to run this command because you\re not the guild owner!',
        CHANNEL_NOT_NSFW: 'You cannot run this command in a non-NSFW channel!',
        MISSING_PERMISSIONS:
    'You do not have the permission to run this command, missing permissions.',
        COMPONENT_NOT_PUBLIC: 'You are not the author of this button!',
        GUILD_COOLDOWN:
    'You are currently in cooldown, you have the ability to re-use this command again in `%cooldown%s`.',
    },
};

module.exports = config;
