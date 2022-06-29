const Discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const webhookClient = new Discord.WebhookClient({
  url: process.env.importantLogs,
});
module.exports = {
  name: "guildDelete",
  async execute(client, guild) {
    Guild.findOneAndDelete(
      {
        guildId: guild.id,
      },
      (err, res) => {
        if (err) console.log(err);
        logger.info(`Left from "${guild.name}" (${guild.id})`, {
          label: "Guilds",
        });
      }
    );
    let owner = await guild.fetchOwner();
    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`RED`)
      .setTitle("Leave Server")
      .setThumbnail(`https://Aeona.xyz/logo`)
      .setDescription(`Aeona left a Server!`)
      .addField(`Server Name`, `\`${guild.name}\``, true)
      .addField(`Server ID`, `\`${guild.id}\``, true)
      .setFooter({
        text: `${this.client.guilds.cache.size} guilds `,
        iconURL: "https://Aeona.xyz/logo.png",
      });

    webhookClient.send({
      username: "Aeona",
      avatarURL: "https://Aeona.xyz/logo.png",
      embeds: [welcomeEmbed],
      content: "@everyone",
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});
  },
};
