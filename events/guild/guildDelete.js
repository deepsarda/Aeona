const Discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const webhookClient = new Discord.WebhookClient({
  url: process.env.importantLogs,
});
module.exports = {
  name: "guildDelete",
  async execute(client, guild) {
    let owner = await guild.fetchOwner();
    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`RED`)
      .setTitle("Leave Server")
      .setThumbnail(`${process.env.domain}/logo`)
      .setDescription(`Aeona left a Server!`)
      .addField(`Server Name`, `\`${guild.name}\``, true)
      .addField(`Server ID`, `\`${guild.id}\``, true)
      .setFooter({
        text: `${this.client.guilds.cache.size} guilds `,
        iconURL: `${process.env.domain}/logo.png`,
      });

    webhookClient.send({
      username: "Aeona",
      avatarURL: `${process.env.domain}/logo.png`,
      embeds: [welcomeEmbed],
      content: "@everyone",
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});
  },
};
