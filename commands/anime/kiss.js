const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "kiss",
      aliases: ["kiss"],
      description: "Kiss a user",
      category: "anime",
    });
  }
  async run(message, args) {
    let client = message.client;
    const member =
      (await message.mentions.members.first()) ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) =>
          r.user.username.toLowerCase().includes() ===
          args.join(" ").toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        (r) =>
          r.displayName.toLowerCase().includes() ===
          args.join(" ").toLocaleLowerCase()
      );
    if (!member) {
      return message.reply(
        ` You must mention someone to kiss!\n\n**Usage:** \`+ kiss <user>\``
      );
    }
    if (message.author === member || message.member == member) {
      return message.reply(` You can't kiss yourself...`);
    }
    const response = await fetch("https://nekos.life/api/v2/img/kiss");
    const body = await response.json();
    const embed = new MessageEmbed() // Prettier
      .setAuthor({
        name: `${member.displayName} just got a kiss from ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        }),
      })
      .setDescription(
        `>>> So sweeet :3${
          Math.floor(Math.random() * 100 + 1) < 10
            ? "\n||I want someone I can kiss...||"
            : ""
        }`
      )
      .setImage(body.url)
      .setColor("RANDOM")
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
        }),
      })
      .setTimestamp()
      .setURL(body.url);
    message.reply({ embeds: [embed] });
  }
};
