const Discord = require("discord.js");
const getComponents = require("./getComponent");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.User} player1
 * @param {Discord.Message} message
 */
module.exports = function (player1, message, timeout) {
  return new Promise(async (resolve) => {
    const that = this;

    const msg = await player1.send({
      embeds: [
        { color: "AQUA", title: `Choose your move, ${player1.username}` },
      ],
      components: await getComponents.bind(that)(timeout),
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) =>
        i.message.id === msg.id &&
        i.customId.endsWith("_fight_game") &&
        i.user.id === player1.id,
      time: this.options.moveTime,
    });

    collector.on("collect", (interaction) => {
      const move = parseInt(interaction.customId[0]);

      if (move === 4) {
        interaction.update({
          embeds: [{ color: "GREEN", title: "Game ended successfully" }],
          components: [],
        });
        message.channel.send({
          embeds: [
            {
              color: "GREEN",
              title: that.options.forceEndMessage.replace(
                /{user}/g,
                player1.username
              ),
            },
          ],
        });

        resolve("end");
      } else {
        interaction.update({ components: [] });

        resolve(move);
      }

      collector.stop(undefined);
    });

    collector.on("end", (shit, reason) => {
      if (reason !== "time") return;

      msg.edit({
        embeds: [
          {
            color: "RED",
            title:
              player1.username +
              ", You took way to much time to respond so game is ended",
          },
        ],
        components: [],
      });
      message.channel.send({
        embeds: [
          {
            color: "GREEN",
            title: that.options.timeEndMessage.replace(
              /{user}/g,
              player1.username
            ),
          },
        ],
      });

      resolve("end");
    });
  });
};
