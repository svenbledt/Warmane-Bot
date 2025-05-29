const { success } = require('../../utils/Console');
const Event = require('../../structure/Event');
const config = require('../../config');
const Logger = require('../../utils/Logger');
const { PermissionsBitField } = require('discord.js');

const COOLDOWN_HOURS = 24;

async function updateStatus(client) {
    const guilds = client.guilds.cache.size;
    let users = 0;

    for (const guild of client.guilds.cache.values()) {
        try {
            await guild.members.fetch();
            const nonBotMembersCount = guild.members.cache.filter(
                (member) => !member.user.bot
            ).size;
            users += nonBotMembersCount;
        } catch (error) {
            console.error(`Failed to fetch members for guild ${guild.id}:`, error);
        }
    }

    client.user.setPresence({
        activities: [
            {
                name: 'keep this empty',
                type: 4,
                state: `Serving ${users} players in ${guilds} guilds`,
            },
        ],
        status: 'dnd',
    });
}

const permissionTranslations = {
    [PermissionsBitField.Flags.CreateInstantInvite]: 'Create Invite',
    [PermissionsBitField.Flags.ManageGuild]: 'Manage Server',
};

async function generateAndSendInvites(client) {
    try {
        const inviteChannel = client.channels.cache.get(config.development.inviteChannel);

        // Fetch and delete existing messages
        const messages = await inviteChannel.messages.fetch({ limit: 100 });
        for (const message of messages.values()) {
            await message.delete();
        }

        const inviteResults = [];
        const errorResults = [];

        for (const guild of client.guilds.cache.values()) {
            if (guild.systemChannel) {
                try {
                    const botMember = guild.members.cache.get(client.user.id);
                    const requiredPermissions = [
                        PermissionsBitField.Flags.CreateInstantInvite,
                        PermissionsBitField.Flags.ManageGuild
                    ];
                    
                    const missingPermissions = requiredPermissions.filter(
                        (perm) => !botMember.permissions.has(perm)
                    );

                    if (missingPermissions.length > 0) {
                        throw {
                            code: 50013,
                            missingPermissions: missingPermissions,
                            translatedPermissions: missingPermissions.map(
                                (perm) => permissionTranslations[perm] || String(perm)
                            ),
                        };
                    }

                    const invites = await guild.invites.fetch();
                    const botInvites = invites.filter(
                        (invite) => invite.inviter && invite.inviter.id === client.user.id
                    );

                    for (const invite of botInvites.values()) {
                        await invite.delete();
                    }

                    const invite = await guild.systemChannel.createInvite({
                        maxAge: 0,
                        maxUses: 1,
                    });

                    // Check if logging is enabled for this guild before attempting to log
                    const guildSettings = await client.getDatabaseHandler().findOne('settings', {
                        guild: guild.id
                    });

                    if (guildSettings?.enableLogging && guildSettings?.logChannel) {
                        await Logger.log(client, guild.id, {
                            titleKey: 'invite_created',
                            descData: { botName: 'Warmane Tool' },
                            color: '#0099ff',
                            fields: [
                                { nameKey: 'invite_created.channel', value: guild.systemChannel.name },
                                { nameKey: 'invite_created.created_by', value: client.user.tag }
                            ]
                        });
                    }

                    inviteResults.push(`${guild.name}: ${invite.url}`);

                } catch (error) {
                    if (error.code === 50013) {
                        try {
                            const owner = await guild.fetchOwner();
                            const now = Date.now();
            
                            const guildSettings = await client.getDatabaseHandler().findOne('settings', {
                                guild: guild.id
                            });

                            const lastDMTime = guildSettings?.lastOwnerDM?.[owner.id] || 0;
                            const cooldownExpired = now - lastDMTime > COOLDOWN_HOURS * 60 * 60 * 1000;

                            if (cooldownExpired) {
                                const missingPerms = error.translatedPermissions
                                    ? `Missing permissions: ${error.translatedPermissions.join(', ')}`
                                    : 'Missing permissions: "Create Invite" and "Manage Server"';

                                await owner.send(
                                    `Hello! I'm missing permissions in your guild "${guild.name}".\n\n${missingPerms}\n(These permissions can be found in Server Settings -> Roles -> Bot Role)\n\nPlease update my permissions or consider removing me from the server if I'm not needed.\n\nSupport Server: https://discord.gg/invte/YDqBQU43Ht`
                                );

                                errorResults.push(`${guild.name}: ${missingPerms}`);

                                // Update lastOwnerDM timestamp
                                if (!guildSettings.lastOwnerDM) guildSettings.lastOwnerDM = {};
                                guildSettings.lastOwnerDM[owner.id] = now;
              
                                await client.getDatabaseHandler().updateOne('settings',
                                    { guild: guild.id },
                                    { $set: { lastOwnerDM: guildSettings.lastOwnerDM } }
                                );
                            }
                        } catch (dmError) {
                            console.error(`Couldn't DM owner of ${guild.name}:`, dmError);
                        }
                    } else {
                        console.error(`Error in guild ${guild.name}:`, error);
                        errorResults.push(`${guild.name}: Unknown error occurred`);
                    }
                }
            }
        }

        let finalMessage = '**Server Invite Links**\n\n';
  
        if (inviteResults.length > 0) {
            finalMessage += '✅ **Active Invites:**\n';
            finalMessage += inviteResults.map(result => `• ${result}`).join('\n');
        }
  
        if (errorResults.length > 0) {
            finalMessage += '\n\n❌ **Errors:**\n';
            finalMessage += errorResults.map(result => `• ${result}`).join('\n');
        }

        if (finalMessage.length > 2000) {
            const chunks = finalMessage.match(/.{1,2000}/g) || [];
            for (const chunk of chunks) {
                await inviteChannel.send(chunk);
            }
        } else {
            await inviteChannel.send(finalMessage);
        }
    } catch (error) {
        console.error('Error in invite generation:', error);
    }
}

module.exports = new Event({
    event: 'ready',
    once: true,
    run: async (client) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Update all guild settings on startup
        await client.getDatabaseHandler().updateAllGuildSettings(client);
        await updateStatus(client);
        await generateAndSendInvites(client);

        success(
            `Logged in as ${client.user.tag}, took ${((Date.now() - client.getLoginTime()) / 1000).toFixed(2)}s.`
        );

        // Schedule recurring tasks
        setInterval(() => {
            generateAndSendInvites(client);
        }, 24 * 60 * 60 * 1000);

        setInterval(() => {
            client.getDatabaseHandler().updateAllGuildSettings(client);
        }, 2 * 60 * 60 * 1000);

        setInterval(() => {
            updateStatus(client);
        }, 300000);
    },
});
