const { info, error, success } = require("../../utils/Console");
const { readdirSync } = require("fs");
const DiscordBot = require("../DiscordBot");
const Component = require("../../structure/Component");
const AutocompleteComponent = require("../../structure/AutocompleteComponent");
const Event = require("../../structure/Event");

class EventsHandler {
  client;

  /**
   *
   * @param {DiscordBot} client
   */
  constructor(client) {
    this.client = client;
  }

  load = () => {
    let total = 0;

    for (const directory of readdirSync("./src/events/")) {
      for (const file of readdirSync("./src/events/" + directory).filter((f) =>
        f.endsWith(".js")
      )) {
        try {
          const module = require("../../events/" + directory + "/" + file);

          if (!module) continue;

          // Parse the module data
          const eventData = module.toJSON ? module.toJSON() : module;

          if (eventData.__type__ === 5) {
            if (!eventData.event || !eventData.run) {
              error("Unable to load the event " + file);
              continue;
            }

            if (eventData.once) {
              this.client.once(eventData.event, (...args) =>
                eventData.run(this.client, ...args)
              );
            } else {
              this.client.on(eventData.event, (...args) =>
                eventData.run(this.client, ...args)
              );
            }

            info(`Loaded new event: ` + file);

            total++;
          } else {
            error(
              "Invalid event type " +
                eventData.__type__ +
                " from event file " +
                file
            );
          }
        } catch (err) {
          error(
            "Unable to load a event from the path: " +
              "src/events/" +
              directory +
              "/" +
              file +
              "\n" +
              err
          );
        }
      }
    }

    success(`Successfully loaded ${total} events.`);
  };
}

module.exports = EventsHandler;
