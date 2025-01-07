require("dotenv").config();
const fs = require("fs");
const DiscordBot = require("./client/DiscordBot");

fs.writeFileSync("./terminal.log", "", "utf-8");
const client = new DiscordBot();

(async () => {
  try {
    await client.connect();
    console.log("Bot verbunden. Warte 10 Sekunden vor dem Trennen...");
    setTimeout(async () => {
      await client.destroy();
      console.log("Bot getrennt.");
      process.exit(0); // Beendet das Skript erfolgreich
    }, 10000); // Warte 10 Sekunden
  } catch (error) {
    console.error("Fehler beim Verbinden oder Trennen des Bots:", error);
    process.exit(1); // Beendet das Skript mit einem Fehlercode
  }
})();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

module.exports = client;
