const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  category: "music",
  description: "Toggle music autoplay",
  requiredArgs: 0,
  usage: "+autoplay",
  permission: [],

  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    const autoplay = player.get("autoplay");

    const emojireplay = client.emoji.autoplay;

    if (autoplay === false) {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", message.member);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      res = await player.search(search, message.member);
      player.queue.add(res.tracks[1]);
      return message.channel.send({
        description: `${emojireplay} Autoplay is now **enabled**`,
      });
    } else {
      player.set("autoplay", false);
      player.queue.clear();

      return message.channel.send({
        description: `${emojireplay} Autoplay is now **disabled**`,
      });
    }
  },
};
