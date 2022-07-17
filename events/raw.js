module.exports = {
  name: "raw",
  async execute(client, data) {
    client.manager.updateVoiceState(data);
  },
};
