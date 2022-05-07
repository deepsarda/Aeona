const Event = require("../../structures/Event");
const Discord = require("discord.js");
const config = require("../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: "https://discord.com/api/webhooks/971700660330459146/C1hPyLLMaU7qTgZ5tv3-1yOHP3N-toRJ_-HiDba2g0gLdRXv-5Hhz5Aiex6AppZH8xF-",
});

module.exports = class extends Event {
  async run(error, message) {
    console.error(error);

    if (
      message.channel &&
      message.channel.viewable &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      message.channel
        .send(
          `${message.client.emoji.fail} Hey ${message.member.displayName}! An Error just occured, make sure to report it here https://discord.gg/SPcmvDMRrP if you can! \`\`\`${error}\`\`\``
        )
        .catch(() => {});
    }

    webhookClient.send(
      `${message.author.username} (${message.author.id})\n${message.content}\n\`\`\`${error}\`\`\``
    );
  }
};
