const fetch = require("node-fetch");

const Guild = require("../database/schemas/Guild");
const Blacklist = require("../database/schemas/blacklist");
module.exports = async function (settings, message, client) {
  if (
    settings.globalChatChannel &&
    message.channel.id == settings.globalChatChannel
  ) {
    const userBlacklistSettings = await Blacklist.findOne({
      discordId: message.author.id,
    });
    if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

    //fetch https://Toxicity.aeona.repl.co  with sentence?=${message.content} and if response does not contain "No" then delete message and tell the user
    let toxicity = await fetch(
      `https://Toxicity.aeona.repl.co/?sentence=${message.content}`
    );
    let toxicityText = await toxicity.text();

    if (!toxicityText.includes("No")) {
      message.delete();
      message.channel
        .send(
          `<@${message.author.id}> Your message has been deleted for being ${toxicityText}.`
        )
        .then(async (s) => {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        })
        .catch(() => {});
    } else {
      async function globalChat() {
        let guilds = await Guild.find({ globalChatChannel: { $ne: null } });
        client.statcord.postCommand(
          "globalChat",
          message.author.id,
          message.client
        );
        console.log(
          `${message.member.displayName} sent ${message.content} in ${message.guild.name} ${message.author.id}`
        );

        function linkify(text) {
          var urlRegex =
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
          return text.replace(urlRegex, function (url) {
            return url.includes("tenor") ? url : "`Link was filtered`";
          });
        }

        message.content = linkify(message.content);
        for (let i = 0; i < guilds.length; i++) {
          let guild = guilds[i];
          if (guild.guildId != message.guild.id) {
            let channel = null;
            try {
              channel = await client.channels.fetch(guild.globalChatChannel);
            } catch (e) {}
            if (channel) {
              async function send() {
                try {
                  //Create a webhook for the channel if it doesn't exist

                  let webhooks = await channel.fetchWebhooks();
                  let webhook = webhooks.find((webhook) => webhook.token);

                  if (!webhook) {
                    webhook = await channel.createWebhook(
                      `${client.user.username} Global Chat`,
                      {
                        avatar: client.user.displayAvatarURL(),
                      }
                    );
                  }

                  webhook.send({
                    username: message.member.displayName,
                    avatarURL: message.member.displayAvatarURL(),
                    content: message.content,
                    embeds: message.embeds,

                    allowedMentions: { parse: [] },
                  });

                  if (message.attachments.size > 0) {
                    for (const [key, value] of message.attachments) {
                      webhook.send({
                        username: message.member.displayName,
                        avatarURL: message.member.displayAvatarURL(),
                        files: [value.url],
                      });
                    }
                  }
                } catch (e) {
                  channel
                    .send(
                      `Please give me MANAGE_WEBHOOKS permission to recieve global chat messages.`
                    )
                    .catch(() => {});
                }
              }
              send();
            }
          }
        }
      }
      globalChat();
    }
  }
};
