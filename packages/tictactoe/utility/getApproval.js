const { User, MessageActionRow, MessageButton } = require("discord.js");

/**
 *
 * @param {User} player
 * @returns
 */
async function getApproval(player, message) {
  return new Promise(async (res, rej) => {
    try {
      let channel = await player.createDM();
      let msg = await channel.send({
        components: [
          new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId("1_tic_tac_toe_choose")
              .setStyle("SUCCESS")
              .setEmoji("✔")
              .setLabel("Accept"),
            new MessageButton()
              .setCustomId("2_tic_tac_toe_choose")
              .setStyle("DANGER")
              .setEmoji("❌")
              .setLabel("Reject"),
          ]),
        ],
        embeds: [
          {
            color: "DARK_NAVY",
            title: this.requestTitle,
            fields: [
              { name: "Sender", value: message.author.username, inline: true },
              { name: "Server", value: message.guild.name, inline: true },
              {
                name: "Channel",
                value: message.channel.toString(),
                inline: true,
              },
            ],
          },
        ],
      });

      let collector = channel.createMessageComponentCollector({
        filter: (i) =>
          i.user.id === player.id &&
          i.message.id === msg.id &&
          i.customId.endsWith("_tic_tac_toe_choose"),
        time: 30000,
      });

      collector.on("collect", (i) => {
        collector.stop(i.customId[0]);
      });

      collector.on("end", (f, r) => {
        let move = true;
        if (r === "time" || r === "2") move = false;

        if (r === "time") {
          message.channel.send({
            embeds: [
              {
                color: "RED",
                title: `${player.username} was too lazy to reply, so game is ended`,
              },
            ],
          });
          msg.reply({
            embeds: [{ color: "RED", title: "You took too long to respond" }],
          });
        } else if (r === "2") {
          message.channel.send({
            embeds: [
              {
                color: "RED",
                title: `${player.username} declined to join the game`,
              },
            ],
          });
          f.first().reply({
            embeds: [
              { color: "GREEN", title: "Successfully denied game invitation" },
            ],
          });
          msg.delete();
        } else if (r === "1") {
          msg.delete();
          message.channel.send({
            embeds: [
              {
                color: "GREEN",
                title: `${player.username} Accepted the game invitation`,
              },
            ],
          });
          f.first().reply({
            embeds: [
              {
                color: "GREEN",
                title: "Successfully accepted game invitation",
              },
            ],
          });
        }

        res(move);
      });
    } catch (e) {
      console.log(e);
      rej(false);
    }
  });
}

module.exports = getApproval;
