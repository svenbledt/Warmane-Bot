const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const config = require("../../config");

function ensureGuildSettings(guildSettings) {
  const defaultSettings = {
    welcomeMessage: false,
    welcomeChannel: "",
    CharNameAsk: false,
    BlockList: true,
    welcomeMessageDM:
      "Hey, I would like to ask you for your main Character name.\nPlease respond with your main Character name for the Server.\n\n(Your response will not be stored by this Application and is only used for the Guilds nickname)",
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

function updateStatus(client) {
  const guilds = client.guilds.cache.size;
  const users = client.guilds.cache.reduce((acc, guild) => {
    // Filter out bot members and then sum up the member count
    const nonBotMembersCount = guild.members.cache.filter(member => !member.user.bot).size;
    return acc + nonBotMembersCount;
  }, 0);
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
        maxAge: 0, // 0 means the invite does not expire
        maxUses: 1, // the invite can be used only once
      });

      return inviteChannel.send(
        `Invite link for guild ${guild.name}: ${invite.url}`
      );
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
    }, 4000); // 5 minutes in milliseconds
  },
}).toJSON();
