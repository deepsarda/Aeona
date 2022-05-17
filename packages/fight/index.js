const Discord = require("discord.js");
const { Options, getMove, getResult, getContent } = require("./utility");

class fight {
  /**
   *
   * @param {Discord.Client} client
   * @param {fightOptions} options
   */
  constructor(client, options = {}) {
    this.client = client;
    this.options = new Options(options);
  }

  /**
   * An solo mode for fighting game, User VS Bot.
   * @param {Discord.Message} message The messages in which command was used
   */
  async solo(message) {
    if (
      !message ||
      typeof message !== "object" ||
      !message.channel ||
      (!message.author && !message.user)
    )
      throw new Error(
        "please provided a valid, message object\n\nFor support please contact us on discord : https://discord.gg/XYnMTQNTFh"
      );

    if (!message.author && message.user) message.author = message.user;

    let userHealth = this.options.startHealth,
      botHealth = this.options.startHealth,
      userTiemout = [];
    let msg = await message.channel.send({
      embeds: [{ color: "DARK_NAVY", title: this.options.startMessage }],
    });

    while (userHealth > 0 && botHealth > 0) {
      const userChoice = await getMove.bind(this)(
        message.author,
        message,
        userTiemout
      );
      const player2Choice = Math.ceil(Math.random() * 3);

      if (
        userChoice === "end" ||
        (userChoice !== 1 && userChoice !== 2 && userChoice !== 3)
      )
        break;

      const result = getResult.bind(this)(
        userChoice,
        userHealth,
        userTiemout,
        player2Choice,
        botHealth,
        []
      );

      userHealth = result.P1health;
      botHealth = result.P2health;
      userTiemout = result.P1timeout;

      const userMove =
        userChoice === 1
          ? this.options.oneName
          : userChoice === 2
          ? this.options.twoName
          : this.options.threeName;
      const user2Move =
        player2Choice === 1
          ? this.options.oneName
          : player2Choice === 2
          ? this.options.twoName
          : this.options.threeName;

      let content = getContent(
        result,
        message.author,
        this.client.user,
        userMove,
        user2Move
      );
      let title = this.options.midMessage;

      if (botHealth < 1 || userHealth < 1) {
        msg.channel.send({ embeds: [{ title: title, description: content }] });
        message.author.send({
          embeds: [{ title: title, description: content }],
        });
        if (botHealth < 1)
          title = this.options.endMessage
            .replace(/{winner}/g, message.author.username)
            .replace(/{looser}/g, this.client.user.username);
        else if (userHealth < 1)
          title = this.options.endMessage
            .replace(/{winner}/g, this.client.user.username)
            .replace(/{looser}/g, message.author.username);

        msg.channel.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || botHealth < 1 ? "" : content,
            },
          ],
        });
        console.log(
          "Sending message to " +
            message.author.username +
            " and " +
            this.client.user.username
        );
        await message.author.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || botHealth < 1 ? "" : content,
            },
          ],
        });
      } else {
        msg.channel.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || botHealth < 1 ? "" : content,
            },
          ],
        });
        console.log(
          "Sending message to " +
            message.author.username +
            " and " +
            this.client.user.username
        );
        await message.author.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || botHealth < 1 ? "" : content,
            },
          ],
        });
      }

      await new Promise((res) => setTimeout(res, 500));
    }
  }

  /**
   * An duo mode for fighting game, User1 VS User2.
   * @param {Discord.Message} message The message in which command was used.
   * @param {Discord.User} player2 The player 2
   */
  async duo(message, player2) {
    if (
      !message ||
      typeof message !== "object" ||
      !message.channel ||
      (!message.author && !message.user)
    )
      throw new Error(
        "please provided a valid, message object\n\nFor support please contact us on discord : https://discord.gg/XYnMTQNTFh"
      );
    if (!player2 || typeof player2 !== "object" || !player2.username)
      throw new Error(
        "please provided a valid, message object\n\nFor support please contact us on discord : https://discord.gg/XYnMTQNTFh"
      );

    if (!message.author && message.user) message.author = message.user;

    if (player2.id === message.author.id)
      throw new Error("Player 2 can't be equal to the message author");
    if (player2.bot) throw new Error("Player 2 can't be a bot");

    let userHealth = this.options.startHealth,
      user2Health = this.options.startHealth,
      userTiemout = [],
      user2Tiemout = [];
    let msg = await message.channel.send({
      embeds: [{ color: "DARK_NAVY", title: this.options.startMessage }],
    });

    while (userHealth > 0 && user2Health > 0) {
      const userChoice = await getMove.bind(this)(
        message.author,
        message,
        userTiemout
      );
      const player2Choice = await getMove.bind(this)(
        player2,
        message,
        user2Tiemout
      );

      if (
        userChoice === "end" ||
        player2Choice === "end" ||
        (userChoice !== 1 && userChoice !== 2 && userChoice !== 3) ||
        (player2Choice !== 1 && player2Choice !== 2 && player2Choice !== 3)
      )
        break;

      const result = getResult.bind(this)(
        userChoice,
        userHealth,
        userTiemout,
        player2Choice,
        user2Health,
        user2Tiemout
      );

      userHealth = result.P1health;
      user2Health = result.P2health;
      userTiemout = result.P1timeout;
      user2Tiemout = result.P2timeout;

      const userMove =
        userChoice === 1
          ? this.options.oneName
          : userChoice === 2
          ? this.options.twoName
          : this.options.threeName;
      const user2Move =
        player2Choice === 1
          ? this.options.oneName
          : player2Choice === 2
          ? this.options.twoName
          : this.options.threeName;

      let content = getContent(
        result,
        message.author,
        player2,
        userMove,
        user2Move
      );
      let title = this.options.midMessage;

      if (user2Health < 1)
        title = this.options.endMessage
          .replace(/{winner}/g, message.author.username)
          .replace(/{looser}/g, player2.username);
      else if (userHealth < 1)
        title = this.options.endMessage
          .replace(/{looser}/g, message.author.username)
          .replace(/{winner}/g, player2.username);

      if (userHealth < 1 || user2Health < 1) {
        msg.channel.send({ embeds: [{ title: title, description: content }] });
        message.author.send({
          embeds: [{ title: title, description: content }],
        });
        player2.send({ embeds: [{ title: title, description: content }] });
        if (user2Health < 1)
          title = this.options.endMessage
            .replace(/{winner}/g, message.author.username)
            .replace(/{looser}/g, player2.username);
        else if (userHealth < 1)
          title = this.options.endMessage
            .replace(/{looser}/g, message.author.username)
            .replace(/{winner}/g, player2.username);

        content = "Game ended";
        console.log(
          "Sending message to " +
            message.author.username +
            " and " +
            player2.displayName
        );
        await message.author.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
        await player2.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
        msg.channel.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
      } else {
        console.log(
          "Sending message to " +
            message.author.username +
            " and " +
            player2.username
        );
        await message.author.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
        msg.channel.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
        await player2.send({
          embeds: [
            {
              title: title,
              description: userHealth < 1 || user2Health < 1 ? "" : content,
            },
          ],
        });
      }
    }
  }
}

module.exports = fight;

/**
 * @typedef {Object} fightOptions The options of fighting module
 * @property {String} startMessage The message title during game's starting
 * @property {String} midMessage The message title when both user chose their move
 * @property {String} endMessage The message title at the end of the game
 * @property {String} forceEndMessage The message title when game is ended forcefully
 * @property {String} timeEndMessage The message title when user didn't responded to bot's DM
 * @property {String} oneName First move's name
 * @property {String} oneEmoji First move's emoji
 * @property {String} twoName Second move's name
 * @property {String} twoEmoji Second move's emoji
 * @property {String} threeName Third move's name
 * @property {String} threeEmoji Third move's emoji
 * @property {String} endName Game end's name
 * @property {String} endEmoji Game end's emoji
 * @property {Number} startHealth The starting health of players
 * @property {Number} defenseSuccessRateAgainstDefense Success rate of defending against enemy defending
 * @property {Number} defenseSuccessRateAgainstMelee Success rate of defending against enemy using melee move
 * @property {Number} defenseSuccessRateAgainstRanged Success rate of defending against enemy using ranged move
 * @property {Number} maxDefense Maximum defense points
 * @property {Number} minDefense Minimum defense points
 * @property {Number} defenseTimeoutRate Chances to get timeout to use defense move
 * @property {Number} maxMelee Maximum Melee points
 * @property {Number} minMelee Minimum Melee points
 * @property {Number} meleeSuccessRate Chances of Melee move success
 * @property {Number} meleeTimeoutRate Chances to get timeout to use melee move
 * @property {Number} maxRanged Maximum Ranged points
 * @property {Number} minRanged Minimum Ranged points
 * @property {Number} rangedTimeoutRate Chances to get timeout to use ranged move
 * @property {Number} rangedSuccessRate Chances of Ranged move success
 */
