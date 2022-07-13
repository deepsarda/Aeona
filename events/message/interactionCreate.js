module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (interaction.customId) {
      if (interaction.customId == "close") {
        cmd = client.commands.get("close");
        cmd.execute(interaction, [], client, "");
      } else if (interaction.customId == "claim") {
        cmd = client.commands.get("claim");
        cmd.execute(interaction, [], client, "");
      }
    }
  },
};
