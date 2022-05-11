const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "slap",
      aliases: ["slap"],
      description: "Slap someone!",
      category: "Anime",
      cooldown: 3,
      usage: "<user>",
    });
  }
  async run(message, args) {
    if (!args[0]) return message.channel.send(`Please specify a user to slap!`);
    const member =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(`Please specify a valid user!`);
    const res = await fetch(`https://nekos.life/api/v2/img/slap`).catch(() => {
      return message.channel.send(`An error occured while fetching the image!`);
    });
    const embed = await new MessageEmbed() // Prettier
      .setColor("RANDOM")
      .setTitle(
        `${member.user.username} just got slapped by ${message.author.username}`
      )
      .setImage(await res.json().url)
      .setFooter({
        text: `Requested by ${message.author.username} • That must hurt ._.`,
        iconURL: message.author.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        }),
      })
      .setImage(body.url);
    message.reply({ embeds: [embed] });
  }
};
