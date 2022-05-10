const Event = require("../structures/Event");

module.exports = class extends Event {
  async run(data) {
    this.client.musicManager.updateVoiceState(data);
  }
};
