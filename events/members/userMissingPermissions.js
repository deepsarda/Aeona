const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  async execute(client, permissions, message) {
    if (!message) return;
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.member.tag}`,
        message.member.displayAvatarURL({ dynamic: true })
      )
      .setTitle(`X Missing User Permissions`)
      .setDescription(
        `Required Permission: \`${permissions.replace("_", " ")}\``
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.domain}` })
      .setColor(message.guild.me.displayHexColor);
    if (
      message.channel &&
      message.channel.viewable &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      message.channel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
