const { WebhookClient, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");
const premiumrip = new WebhookClient({
  url: process.env.WEBHOOK_URL,
});
const Guild = require("../database/schemas/Guild");
const moment = require(`moment`);
const fetchAll = require("../structures/fetchAll");
const emojiArray = require("../structures/optionArray");
const pollModel = require("../database/schemas/poll");
module.exports = {
  name: "ready",
  async execute(client) {
    client.manager.init(client.user.id);
    client.statcord.autopost();

    setInterval(async () => {
      const conditional = {
        isPremium: "true",
      };
      const results = await Guild.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (
            Number(result.premium.redeemedAt) >=
            Number(result.premium.expiresAt)
          ) {
            const guildPremium = client.guilds.cache.get(result.guildId);
            if (guildPremium) {
              const user = await client.users.cache.get(
                result.premium.redeemedBy.id
              );

              if (user) {
                const embed = new Discord.MessageEmbed().setDescription(
                  `Hey ${user.username}, Premium in ${guildPremium.name} has Just expired :(\n\n__You can you re-new your server here! [https://Aeona.xyz/premium](https://Aeona.xyz/premium)__\n\nThank you for purchasing premium Previously! We hope you enjoyed what you purchased.\n\n**- Aeona**`
                );

                user.send({ embeds: [embed] }).catch(() => {});
              }

              const rip = new Discord.MessageEmbed()
                .setDescription(
                  `**Premium Subscription**\n\n**Guild:** ${
                    guildPremium.name
                  } | **${guildPremium.id}**\nRedeemed by: ${
                    user.tag || "Unknown"
                  }\n**Plan:** ${result.premium.plan}`
                )
                .setColor("RED")
                .setTimestamp();

              await premiumrip
                .send({
                  username: "Aeona Loose Premium",
                  avatarURL: `${process.env.domain}/logo.png`,
                  embeds: [rip],
                })
                .catch(() => {});

              result.isPremium = "false";
              result.premium.redeemedBy.id = null;
              result.premium.redeemedBy.tag = null;
              result.premium.redeemedAt = null;
              result.premium.expiresAt = null;
              result.premium.plan = null;

              await result.save().catch(() => {});
            }
          }
        }
      }
    }, 500000);

    setInterval(async () => {
      for (const guild of client.guilds.cache) {
        const pollArray = await pollModel
          .find({
            guild: guild[0],
          })
          .catch((err) => console.log(err));

        for (const poll of pollArray) {
          if (Date.now() >= Number(poll.expiryDate)) {
            if (!poll.textChannel) return;

            const channel = client.channels.cache.get(poll.textChannel);
            const msg = await channel.messages
              .fetch(poll.message)
              .catch(() => {});

            const resultsArr = [];

            for (const e of emojiArray()) {
              const allReactions = await fetchAll(msg, e).catch((err) =>
                console.log(err)
              );
              resultsArr.push([
                e,
                typeof allReactions == "object"
                  ? allReactions.length
                  : undefined,
              ]);
            }

            resultsArr.sort((a, b) => b[1] - a[1]);

            let votes = `Votes`;
            if (resultsArr[0][1] == "1") votes = `Vote`;

            if (resultsArr[0][1] == resultsArr[1][1]) {
              if (msg) {
                let embed = new MessageEmbed()
                  .setTitle(poll.title)
                  .setDescription(
                    `It was a tie! Tied on **${resultsArr[0][1] - 1}** ${votes}`
                  )
                  .setColor("YELLOW")
                  .setFooter({
                    text: `Ended at ${moment(new Date()).format("LLLL")}`,
                  });
                msg.edit({ embeds: [embed] }).catch(() => {});
                msg.reactions.removeAll().catch(() => {});
                if (
                  !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")
                )
                  return;
                await poll.deleteOne().catch(() => {});
                channel.send(
                  `It was a tie! \nhttps://discordapp.com/channels/${msg.guild.id}/${channel.id}/${msg.id}`
                );
              } else {
                if (
                  !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")
                )
                  return;
                await poll.deleteOne().catch(() => {});
                channel
                  .send(`The Poll was a Tie!  \n**(Poll was Deleted)** `)
                  .catch(() => {});
              }
              return;
            } else {
              if (msg) {
                let embed = new MessageEmbed()
                  .setTitle(poll.title)
                  .setDescription(
                    `The winner of the poll was option ${
                      resultsArr[0][0]
                    } with ${resultsArr[0][1] - 1} vote(s) `
                  )
                  .setColor(`GREEN`)
                  .setFooter({
                    text: `Ended at ${moment(new Date()).format("LLLL")}`,
                  });
                msg.edit({ embeds: [embed] }).catch(() => {});
                msg.reactions.removeAll().catch(() => {});
                if (
                  !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")
                )
                  return;
                await poll.deleteOne().catch(() => {});
                channel.send(
                  `The winner of the poll was option ${resultsArr[0][0]}  - ${
                    resultsArr[0][1] - 1
                  } vote(s) \nhttps://discordapp.com/channels/${msg.guild.id}/${
                    channel.id
                  }/${msg.id}`
                );
              } else {
                if (
                  !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")
                )
                  return;
                await poll.deleteOne().catch(() => {});
                channel.send(
                  `The winner of the poll was option ${resultsArr[0][0]} - ${
                    resultsArr[0][1] - 1
                  } vote(s)  \n**(Poll was Deleted)**`
                );
              }
            }
            await poll.deleteOne().catch((err) => console.log(err));
            return;
          }
        }
      }
    }, 60000);

    setInterval(async () => {
      let conditional = {
        bump: {
          enabled: true,
        },
      };

      const results = await Guild.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (result.channel && !result.reminded) {
            if (result.bump.lastBump + 2 * 60 * 60 * 10000 < Date.now()) {
              const channel = client.channels.cache.get(result.channel);
              if (channel) {
                channel.send(result.bumpMessage);
              }
            }

            result.reminded = true;
            await result.save().catch(() => {});
          }
        }
      }
    }, 60000);
    client.status = await require("../presence_config");
    setInterval(() => {
      const emoji =
        client.status.emojis[
          Math.floor(Math.random() * client.status.emojis.length)
        ];
      if (client.status.options.type == "dynamic") {
        const today = moment().format("MM-DD");
        const special_message = client.status.dates[today];
        if (special_message) {
          const motd =
            special_message[Math.floor(Math.random() * special_message.length)];
          if (motd.message && motd.type) {
            client.user.setActivity(motd.message, {
              type: motd.type,
            });
          }
        } else {
          const dynamic_message =
            client.status.dynamic[
              Math.floor(Math.random() * client.status.dynamic.length)
            ];
          const message = dynamic_message.message
            .replaceAll("{{ emoji }}", emoji)
            .replaceAll(
              "{{ members }}",
              client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
            )
            .replaceAll("{{ servers }}", client.guilds.cache.size);
          client.user.setActivity(message, {
            type: dynamic_message.type,
          });
        }
      } else {
        if (client.status.static.message && client.status.static.type) {
          client.user.setActivity(client.status.static.message, {
            type: client.status.static.type,
          });
        }
      }
    }, 10000);
  },
};
