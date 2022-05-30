const { MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");

module.exports = {
  name: "playerMove",
  async execute(client, player, oldChannel, newChannel) {
    const guild = client.guilds.cache.get(player.guild);
    if (!guild) return;
    const channel = guild.channels.cache.get(player.textChannel);
    if (oldChannel === newChannel) return;
    if (newChannel === null || !newChannel) {
      if (!player) return;
      if (channel)
        await channel.send({
          description: `I've been disconnected from <#${oldChannel}>`,
        });
      return player.destroy();
    } else {
      player.voiceChannel = newChannel;

      if (channel)
        await channel.send({
          description: `Player voice channel moved to <#${player.voiceChannel}>`,
        });
      if (player.paused) player.pause(false);
    }
  },
};
