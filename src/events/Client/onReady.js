const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");
const Logger = require('../../utils/Logger');

const COOLDOWN_HOURS = 24;

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    language: "en",  // Add default language setting
    logChannel: "", // Add logging channel setting
    enableLogging: false, // Add logging toggle
    charNameAskDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.",
    lastOwnerDM: {},
    // Add any other default settings here
  };

  let updated = false;

  for (const [key, value] of Object.entries(defaultSettings)) {
    if (!guildSettings.hasOwnProperty(key)) {
      guildSettings[key] = value;
      updated = true;
    }
  }

  return updated;
}

async function updateGuildSettings(client) {
  let settings = client.database.get("settings") || [];

  const currentGuildIds = new Set(client.guilds.cache.keys());

  settings = settings.filter((setting) => currentGuildIds.has(setting.guild));

  for (const guildId of currentGuildIds) {
    let guildSettings = settings.find((setting) => setting.guild === guildId);
    const guildName = client.guilds.cache.get(guildId).name; // Hole den Gildennamen

    if (!guildSettings) {
      // Erstelle eine neue Einstellung mit dem Gildennamen an erster Stelle
      guildSettings = { guild: guildId, guildName: guildName };
      settings.push(guildSettings);
    } else {
      // Aktualisiere den Gildennamen, falls er sich geändert hat
      guildSettings.guildName = guildName;
    }

    if (ensureGuildSettings(guildSettings)) {
      client.database.set("settings", settings);
    }
  }

  client.database.set("settings", settings);
}

async function updateStatus(client) {
  const guilds = client.guilds.cache.size;
  let users = 0;

  for (const guild of client.guilds.cache.values()) {
    try {
      // Fetch all members of the guild
      await guild.members.fetch();
      // Count non-bot members
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
        name: "keep this empty",
        type: 4,
        state: `Serving ${users} players in ${guilds} guilds`,
      },
    ],
    status: "dnd",
  });
}

const permissionTranslations = {
  CreateInstantInvite: "Create Invite",
  ManageGuild: "Manage Server",
};

async function generateAndSendInvites(client) {
  const inviteChannel = client.channels.cache.get(config.development.inviteChannel);

  // Fetch all messages from the inviteChannel and delete them
  const messages = await inviteChannel.messages.fetch({ limit: 100 });
  for (const message of messages.values()) {
    await message.delete();
  }

  // Collect all invite information
  const inviteResults = [];
  const errorResults = [];

  for (const guild of client.guilds.cache.values()) {
    if (guild.systemChannel) {
      try {
        // Check bot permissions
        const botMember = guild.members.cache.get(client.user.id);
        const requiredPermissions = ["CreateInstantInvite", "ManageGuild"];
        const missingPermissions = requiredPermissions.filter(
          (perm) => !botMember.permissions.has(perm)
        );

        if (missingPermissions.length > 0) {
          throw {
            code: 50013,
            missingPermissions: missingPermissions,
            translatedPermissions: missingPermissions.map(
              (perm) => permissionTranslations[perm] || perm
            ),
          };
        }

        // Handle invites
        const invites = await guild.invites.fetch();
        const botInvites = invites.filter(
          (invite) => invite.inviter && invite.inviter.id === client.user.id
        );

        // Delete old invites
        for (const invite of botInvites.values()) {
          await invite.delete();
        }

        // Create new invite
        const invite = await guild.systemChannel.createInvite({
          maxAge: 0,
          maxUses: 1,
        });

        await Logger.log(client, guild.id, {
          titleKey: 'invite_created',
          descData: { botName: 'Warmane Tool' },
          color: '#0099ff',
          fields: [
            { nameKey: 'invite_created.channel', value: guild.systemChannel.name },
            { nameKey: 'invite_created.created_by', value: client.user.tag }
          ]
        });

        inviteResults.push(`${guild.name}: ${invite.url}`);

      } catch (error) {
        if (error.code === 50013) {
          // Handle permission error
          try {
            const owner = await guild.fetchOwner();
            const now = Date.now();
            let settings = client.database.get("settings") || [];
            let guildSettings = settings.find(
              (setting) => setting.guild === guild.id
            );

            const lastDMTime = guildSettings?.lastOwnerDM?.[owner.id] || 0;
            const cooldownExpired =
              now - lastDMTime > COOLDOWN_HOURS * 60 * 60 * 1000;

            if (cooldownExpired) {
              const missingPerms = error.translatedPermissions
                ? `Missing permissions: ${error.translatedPermissions.join(", ")}`
                : 'Missing permissions: "Create Invite" and "Manage Server"';

              await owner.send(
                `Hello! I'm missing permissions in your guild "${guild.name}".\n\n${missingPerms}\n(These permissions can be found in Server Settings -> Roles -> Bot Role)\n\nPlease update my permissions or consider removing me from the server if I'm not needed.\n\nSupport Server: https://discord.gg/invte/YDqBQU43Ht`
              );

              errorResults.push(`${guild.name}: ${missingPerms}`);

              if (!guildSettings.lastOwnerDM) guildSettings.lastOwnerDM = {};
              guildSettings.lastOwnerDM[owner.id] = now;
              client.database.set("settings", settings);
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

  // Create and send the formatted message
  let finalMessage = "**Server Invite Links**\n\n";
  
  if (inviteResults.length > 0) {
    finalMessage += "✅ **Active Invites:**\n";
    finalMessage += inviteResults.map(result => `• ${result}`).join('\n');
  }
  
  if (errorResults.length > 0) {
    finalMessage += "\n\n❌ **Errors:**\n";
    finalMessage += errorResults.map(result => `• ${result}`).join('\n');
  }

  // Split message if it exceeds Discord's limit (2000 characters)
  if (finalMessage.length > 2000) {
    const chunks = finalMessage.match(/.{1,2000}/g) || [];
    for (const chunk of chunks) {
      await inviteChannel.send(chunk);
    }
  } else {
    await inviteChannel.send(finalMessage);
  }
}

module.exports = new Event({
  event: "ready",
  once: true,
  run: async (__client__, client) => {
    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Update guild settings immediately after bot has connected
    await updateGuildSettings(client);
    await updateStatus(client);

    // Generate and send invites
    await generateAndSendInvites(client);

    success(
      "Logged in as " +
        client.user.displayName +
        ", took " +
        (Date.now() - __client__.login_timestamp) / 1000 +
        "s."
    );

    // Schedule the task to run every 24 hours
    setInterval(() => {
      generateAndSendInvites(client);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    // Schedule the task to run every 2 hours
    setInterval(() => {
      updateGuildSettings(client);
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    setInterval(() => {
      updateStatus(client);
    }, 300000); // 5 minutes in milliseconds
  },
})
