module.exports = {
  name: "raw",
  execute(client, data) {
    client.manager.updateVoiceState(data);
  },
};
