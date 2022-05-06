const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "cuddle",
      description: "cuddle a user",
      category: "anime",
    });
  }
  async run(message, args) {
    if (!args[0])
      return message.channel.send(
        `Please specify a user to cuddle! \`${
          this.client.commands.get("cuddle").help.usage
        }\``
      );
    const user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    if (!user) return message.channel.send(`Please specify a valid user!`);
    const response = await fetch("https://nekos.life/api/v2/img/cuddle");
    const body = await response.json();
    const embed = new MessageEmbed() // Prettier
      .setTitle(
        `${user.username} has just been cuddled by ${message.author.username}`
      )
      .setDescription(
        `> ${user} got a hug from ${message.author}${
          Math.floor(Math.random() * 100 + 1) < 10
            ? "\n||I want someone I can hug...||"
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
