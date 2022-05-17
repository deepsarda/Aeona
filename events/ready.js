const muteModel = require("../models/mute");
const Event = require("../structures/Event");
const logger = require("../utils/logger");
const Maintenance = require("../database/schemas/maintenance");
const moment = require("moment");
module.exports = class extends Event {
  async run() {
    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });
    for (let i = 0; i < this.client.tankTacticsHandler.data.length; i++) {
      const game = this.client.tankTacticsHandler.data[i];
      await this.client.tankTacticsHandler.updateGame(game, false, false);
    }
    if (maintenance && maintenance.toggle == "true") {
      this.client.user.setPresence({ status: "dnd" });
      this.client.user.setActivity("Under Maintenance");

      logger.info(`✅ loaded Maintenance Mode `, { label: "Status" });
    } else {
      let client = this.client;
      this.client.musicManager.init(client.user.id);
      client.status = await require("../presence_config");
      setInterval(() => {
        const emoji =
          client.status.emojis[
            Math.floor(Math.random() * client.status.emojis.length)
          ];
        if (client.status.options.type == "dynamic") {
          const today = moment().format("MM-DD");
          const special_message = client.status.dates[today];
          if (special_message) {
            const motd =
              special_message[
                Math.floor(Math.random() * special_message.length)
              ];
            if (motd.message && motd.type) {
              client.user.setActivity(motd.message, {
                type: motd.type,
              });
              this.client.user.setPresence({ status: "idle" });
            }
          } else {
            const dynamic_message =
              client.status.dynamic[
                Math.floor(Math.random() * client.status.dynamic.length)
              ];
            // Todo: Allow dynamic strings
            const message = dynamic_message.message
              .replaceAll("{{ emoji }}", emoji)
              .replaceAll(
                "{{ members }}",
                client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
              )
              .replaceAll("{{ servers }}", client.guilds.cache.size);
            client.user.setActivity(message, {
              type: dynamic_message.type,
            });
            this.client.user.setPresence({ status: "idle" });
          }
        } else {
          if (client.status.static.message && client.status.static.type) {
            client.user.setActivity(client.status.static.message, {
              type: client.status.static.type,
            });
            this.client.user.setPresence({ status: "idle" });
          }
        }
      }, 10000);
    }
  }
};
