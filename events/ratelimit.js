const logger = require("../utils/logger");
const Discord = require("discord.js");
const webhookClient = new Discord.WebhookClient({
  url: process.env.rateLimit,
});

module.exports = {
  name: "ratelimit",
  async execute(client, rl) {
    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(
        `**Time out**\n\`${rl.timeout}ms\`\n**Limit:**\n\`${rl.limit}\`\n\n__**Information**__\n**Method:**${rl.method}\n\n**Path:**\n${rl.path} ${rl.route}`
      )
      .setTimestamp();

    await setTimeout(function () {
      webhookClient.send({ embeds: [embed] });
      logger.info(`Time out: ${rl.timeout}ms. Limit: ${rl.limit}`, {
        label: "Rate Limit",
      });
    }, rl.timeout + 10);
  },
};
