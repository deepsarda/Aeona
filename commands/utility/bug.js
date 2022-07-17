const Discord = require("discord.js");
const webhookClient = new Discord.WebhookClient({
  url: process.env.reports,
});
const crypto = require("crypto");

module.exports = {
  name: "bug",
  description: "Report a bug",
  usage: "+bug [message]",
  category: "utility",
  requiredArgs: 1,
  execute: async (message, args, bot, prefix) => {
    let id = crypto.randomBytes(4).toString("hex");
    let invite = await message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .catch(() => {});

    let report = args.join(" ").split("").join("");
    const embed = new Discord.MessageEmbed()
      .setTitle("Bug Report")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report)
      .addField("User", message.member, true)
      .addField("User username", message.member.user.username, true)
      .addField("User ID", message.member.id, true)
      .addField("User Tag", message.member.user.tag, true)
      .addField("Server", `[${message.guild.name}](${invite || "none "})`, true)
      .addField("Bug Report ID:", `#${id}`, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("GREEN");

    webhookClient.send({
      username: "Aeona Bug Report",
      avatarURL: `${message.client.domain}/logo.png`,
      embeds: [embed],
    });

    message.author.send({ embeds: [embed] }).catch(() => {});
  },
};
