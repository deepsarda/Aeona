const moment = require("moment");
const Snipe = require("../../database/schemas/editsnipe");

module.exports = {
  name: "editsnipe",
  description: "See the edited messages of this channel",
  usage: "+editsnipe",
  category: "utility",
  requiredArgs: 0,
  botPermissions: ["MANAGE_WEBHOOKS"],
  execute: async (message, args, bot, prefix) => {
    let channel = message.mentions.channels.first();
    if (!channel) channel = message.channel;

    const snipe = await Snipe.findOne({
      guildId: message.guild.id,
      channel: channel.id,
    });
    if (!snipe) {
      return message.replyError({
        title: "Editsnipe",
        description: "No editsnipe found for this channel.",
      });
    }

    if (snipe.oldmessage.length < 1)
      return message.replyError({
        title: "Editsnipe",
        description: "No editsnipe found for this channel.",
      });

    let webhooks = await message.channel.fetchWebhooks();
    let webhook = webhooks.find((webhook) => webhook.token);

    if (!webhook) {
      webhook = await message.channel.createWebhook(
        `${client.user.username} Sniping`,
        {
          avatar: client.user.displayAvatarURL(),
        }
      );
    }
    for (let i = 0; snipe.oldmessage.length > i; i++) {
      let member = await message.guild.members.fetch(snipe.id[i]).catch();
      if (!member) await MessageEvent.client.users.fetch(snipe.id[i]).catch();

      webhook.send({
        username: member ? member.user.username : "Unkown",
        avatarURL: member ? member.user.displayAvatarURL() : undefined,
        content: `${snipe.oldmessage[i] || "None"} ➜ ${
          snipe.newmessage[i]
        }\n[Jump To Message](${snipe.url[i]})\n`,

        allowedMentions: { parse: [] },
      });
    }
  },
};
