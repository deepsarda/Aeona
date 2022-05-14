const Event = require("../../structures/Event");
const Discord = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const config = require("../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: "https://discord.com/api/webhooks/971700329869631568/UEj6A3MwgPLqxVRT4eAV1wDGPJPvXU96fofoSofDKiNu63tAV5gG1L7H82_pRsTvQgLd",
});
const welcomeClient = new Discord.WebhookClient({
  url: "https://discord.com/api/webhooks/962202863889686538/TJarYS_MeQg2dVN2LOUoBPYo5uZcHk6rggqJeUe-GMvVJagM5eiEcVE7-fFxsgIViZRr",
});
module.exports = class extends Event {
  async run(guild) {
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

    welcomeClient.send({
      username: "Aeona",
      avatarURL: "https://Aeona.xyz/logo.png",
      embeds: [welcomeEmbed],
      content: "<@394320584089010179> <@794921502230577182>",
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});
    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`I have left the ${guild.name} server.`)
      .setFooter({
        text: `Lost ${guild.members.cache.size - 1} members • I'm now in ${
          this.client.guilds.cache.size
        } servers..\n\nID: ${guild.id}`,
      })
      .setThumbnail(
        guild.iconURL({ dynamic: true })
          ? guild.iconURL({ dynamic: true })
          : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(
              guild.nameAcronym
            )}`
      )
      .addField("Server Owner", `${guild.owner} / ${guild.ownerID}`);

    webhookClient.send({
      username: "Aeona",
      avatarURL: "https://Aeona.xyz/logo.png",
      embeds: [embed],
    });
  }
};
