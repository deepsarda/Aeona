const Event = require("../../structures/Event");
const Discord = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const metrics = require("datadog-metrics");
const Logging = require("../../database/schemas/logging");
const config = require("../../config.json.js");
const webhookClient = new Discord.WebhookClient(
  config.webhook_id,
  config.webhook_url
);
const welcomeClient = new Discord.WebhookClient(
  config.webhook_id,
  config.webhook_url
);
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
      .setFooter(
        `${this.client.guilds.cache.size} guilds `,
        "https://Aeona.xyz/logo.png"
      );

    welcomeClient.send({
      username: "Aeona",
      avatarURL: "https://Aeona.xyz/logo.png",
      embeds: [welcomeEmbed],
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});

    if (config.datadogApiKey) {
      metrics.init({
        apiKey: this.client.config.datadogApiKey,
        host: "Aeona",
        prefix: "Aeona.",
      });
      metrics.increment("guildDelete");
    }

    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`I have left the ${guild.name} server.`)
      .setFooter(
        `Lost ${guild.members.cache.size - 1} members • I'm now in ${
          this.client.guilds.cache.size
        } servers..\n\nID: ${guild.id}`
      )
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
