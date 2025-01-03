const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");

const COOLDOWN_HOURS = 24;

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    welcomeMessageDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
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

function updateGuildSettings(client) {
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
      const nonBotMembersCount = guild.members.cache.filter(member => !member.user.bot).size;
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

async function generateAndSendInvites(client) {
  const inviteChannel = client.channels.cache.get(
    config.development.inviteChannel
  );

  // Fetch all messages from the inviteChannel and delete them
  const messages = await inviteChannel.messages.fetch({ limit: 100 });
  for (const message of messages.values()) {
    await message.delete();
  }

  const promises = client.guilds.cache.map(async (guild) => {
    if (guild.systemChannel) {
      try {
        // Fetch all invites from the guild
        const invites = await guild.invites.fetch();

        // Filter out the invites created by the bot and delete them
        const botInvites = invites.filter(
          (invite) => invite.inviter.id === client.user.id
        );
        for (const invite of botInvites.values()) {
          await invite.delete();
        }

        // Create a new invite
        let invite = await guild.systemChannel.createInvite({
          maxAge: 0,
          maxUses: 1,
        });

        return inviteChannel.send(
          `Invite link for guild ${guild.name}: ${invite.url}`
        );
      } catch (error) {
        if (error.code === 50013) { // Missing Permissions error
          try {
            const owner = await guild.fetchOwner();
            const now = Date.now();
            
            // Get settings from database
            let settings = client.database.get("settings") || [];
            let guildSettings = settings.find(setting => setting.guild === guild.id);

            // Check if owner was DMed recently
            const lastDMTime = guildSettings?.lastOwnerDM?.[owner.id] || 0;
            const cooldownExpired = (now - lastDMTime) > (COOLDOWN_HOURS * 60 * 60 * 1000);

            if (cooldownExpired) {
              await owner.send(
                `Hello! I'm missing permissions in your guild "${guild.name}". I need permissions to manage invites. Please update my permissions or consider removing me from the server if I'm not needed.`
              );

              // Update the lastOwnerDM time in settings
              if (!guildSettings.lastOwnerDM) guildSettings.lastOwnerDM = {};
              guildSettings.lastOwnerDM[owner.id] = now;
              client.database.set("settings", settings);
            }
          } catch (dmError) {
            console.log(`Couldn't DM owner of ${guild.name}: ${dmError.message}`);
          }

          return inviteChannel.send(
            `We miss permissions on Guild ${guild.name}! Please consider leaving it.`
          );
        }
        // Re-throw other errors
        throw error;
      }
    }
  });

  await Promise.all(promises);
}

module.exports = new Event({
  event: "ready",
  once: true,
  run: (__client__, client) => {
    success(
      "Logged in as " +
        client.user.displayName +
        ", took " +
        (Date.now() - __client__.login_timestamp) / 1000 +
        "s."
    );

    // Update guild settings immediately after bot has connected
    updateGuildSettings(client);
    updateStatus(client);

    // Generate and send invites
    generateAndSendInvites(client);

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
}).toJSON();
