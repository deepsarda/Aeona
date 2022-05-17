const Discord = require("discord.js");
const {
  getChoice,
  getComponents,
  getDescription,
  getWinner,
  getApproval,
} = require("./utility");

class TicTacToe {
  /**
   * The Tic Tac Toe object
   * @param {Object} options The options for the game
   * @param {Number} options.autoDelete Time after which auto delete useless bot messages.
   * @param {String} options.startTitle The game starting title.
   * @param {String} options.requestTitle The title for request message in user DM.
   * @param {String} options.forceEndTitle The title when game is ended forcefully
   * @param {String} options.forceEndDescription The description when game is ended forcefully
   * @param {String} options.timeEndTitle The title when user failed in choosing their move.
   * @param {String} options.timeEndDescription The description when user failed in choosing their move.
   * @param {String} options.drawEndTitle The title when game ended with a draw.
   * @param {String} options.drawEndDescription The description when game ended with a draw.
   * @param {String} options.endTitle The title when game ended normally.
   * @param {String} options.endDescription The description when game ended normally.
   */
  constructor(options = {}) {
    if (
      ("autoDelete" in options && typeof options.autoDelete !== "number") ||
      options.autoDelete < 500
    )
      throw new Error("Auto delete should be an number and at least 500.");

    this.autoDelete = options.autoDelete || 3000;
    this.startTitle = options.startTitle || "Tic Tac Toe Game";
    this.requestTitle = options.requestTitle || "Tic Tac Toe Game Request";
    this.forceEndTitle = options.forceEndTitle || "Game was ended forcefully";
    this.forceEndDescription =
      options.forceEndDescription ||
      "{user} was scared so they ended the game.";
    this.timeEndTitle = options.timeEndTitle || "{user} is tooo slow";
    this.timeEndDescription =
      options.timeEndDescription ||
      "{user} was too scared to choose their move.";
    this.endTitle =
      options.endTitle || "The game ended with victory for {winner}";
    this.endDescription =
      options.endDescription ||
      "The Winner is {winner} 👑\nThe Nerd / loser is {loser} 🤢";
    this.drawEndTitle = options.drawEndTitle || "The game ended with a draw";
    this.drawEndDescription =
      options.drawEndDescription ||
      "Nobody won RIP!!!\n\nPlayer 1 : {player1}\n\nPlayer 2 : {player2}";
  }

  /**
   * The solo game i.e. User VS Bot
   * @param {Discord.Message} message The message in which command was used
   * @param {Discord.Client} bot The discord client
   */
  async solo(message, bot) {
    let botName = bot?.user?.username || "Bot";
    if (!message || !message.author) throw new Error("No message was provided");
    let options = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      user = [],
      botc = [];
    const row = await getComponents(options);
    let ended = false;

    const sent = await message.channel.send({
      components: row,
      embeds: [
        {
          color: "DARK_VIVID_PINK",
          title: this.startTitle,
          description: getDescription(user, botc),
        },
      ],
    });

    while (options.length !== 0) {
      let data = await getChoice.bind(this)(
        message.author,
        message.channel,
        options,
        user,
        botc
      );

      if (data.reason === "time") {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_RED",
              title: this.timeEndTitle.replace(
                /\{user\}/,
                message.author.username
              ),
              description: this.timeEndDescription.replace(
                /\{user\}/,
                message.author.username
              ),
            },
          ],
        });
        ended = true;
        break;
      } else if (data.reason === "cancel") {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_RED",
              title: this.forceEndTitle.replace(
                /\{user\}/,
                message.author.username
              ),
              description: this.forceEndDescription.replace(
                /\{user\}/,
                message.author.username
              ),
            },
          ],
        });
        ended = true;
        break;
      }

      options = data.options;
      user = data.player1;
      botc = data.bot;

      const rowss = await getComponents(options);
      sent.edit({
        components: rowss,
        embeds: [
          {
            color: "DARK_VIVID_PINK",
            title: this.startTitle,
            description: getDescription(user, botc),
          },
        ],
      });

      let win = getWinner(user, botc);
      let winner = win === 1 ? message.author.username : botName;
      let loser = win === 2 ? message.author.username : botName;

      if (win === 0) {
        const r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_BUT_NOT_BLACK",
              title: this.drawEndTitle
                .replace(/\{player1\}/, message.author.username)
                .replace(/\{player2\}/, botName),
              description: this.drawEndDescription
                .replace(/\{player1\}/, message.author.username)
                .replace(/\{player2\}/, botName),
            },
          ],
        });
        ended = true;
        break;
      } else if (win >= 0 && win <= 2) {
        const r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_BUT_NOT_BLACK",
              title: this.endTitle
                .replace(/\{winner\}/, winner)
                .replace(/\{loser\}/, loser),
              description: this.endDescription
                .replace(/\{winner\}/, winner)
                .replace(/\{loser\}/, loser),
            },
          ],
        });
        ended = true;
        break;
      }
    }

    if (ended) return;
    let win = getWinner(user, botc);
    let winner = win === 1 ? message.author.username : botName;
    let loser = win === 2 ? message.author.username : botName;

    if (win === 0) {
      let r = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("no_need_of_id_here")
          .setDisabled(true)
          .setStyle("SECONDARY")
          .setLabel("Game Ended")
          .setEmoji("🕊")
      );
      sent.edit({
        components: [r],
        embeds: [
          {
            color: "DARK_BUT_NOT_BLACK",
            title: this.drawEndTitle
              .replace(/\{player1\}/, message.author.username)
              .replace(/\{player2\}/, botName),
            description: this.drawEndDescription
              .replace(/\{player1\}/, message.author.username)
              .replace(/\{player2\}/, botName),
          },
        ],
      });
      ended = true;
    } else if (win >= 0 && win <= 2) {
      let r = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("no_need_of_id_here")
          .setDisabled(true)
          .setStyle("SECONDARY")
          .setLabel("Game Ended")
          .setEmoji("🕊")
      );
      sent.edit({
        components: [r],
        embeds: [
          {
            color: "DARK_BUT_NOT_BLACK",
            title: this.endTitle
              .replace(/\{winner\}/, winner)
              .replace(/\{loser\}/, loser),
            description: this.endDescription
              .replace(/\{winner\}/, winner)
              .replace(/\{loser\}/, loser),
          },
        ],
      });
      ended = true;
    }
  }

  async duo(message, player2) {
    if (!message || !message.author) throw new Error("No message was provided");
    if (!player2 || !player2.username)
      throw new Error("No Player 2 was provided");

    if (message.author.id === player2.id)
      throw new Error("Player 1 And Player 2 can't be same");
    if (player2.bot) throw new Error("Player 2 shouldn't be a bot");

    if ((await getApproval.bind(this)(player2, message)) === false) return;

    let options = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      player1Choice = [],
      player2Choice = [];
    const row = await getComponents(options);
    let ended = false;

    const sent = await message.channel.send({
      components: row,
      embeds: [
        {
          color: "DARK_VIVID_PINK",
          title: this.startTitle,
          description: getDescription(player1Choice, player2Choice),
        },
      ],
    });

    for (let i = 1; options.length !== 0; i++) {
      let data = await getChoice.bind(this)(
        i % 2 !== 0 ? message.author : player2,
        message.channel,
        options,
        i % 2 !== 0 ? player1Choice : player2Choice
      );

      if (data.reason === "time") {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_RED",
              title: this.timeEndTitle.replace(/\{user\}/, data.user),
              description: this.timeEndDescription.replace(
                /\{user\}/,
                data.user
              ),
            },
          ],
        });
        ended = true;
        break;
      } else if (data.reason === "cancel") {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_RED",
              title: this.forceEndTitle.replace(/\{user\}/, data.user),
              description: this.forceEndDescription.replace(
                /\{user\}/,
                data.user
              ),
            },
          ],
        });
        ended = true;
        break;
      }

      options = data.options;
      i % 2 !== 0
        ? (player1Choice = data.player1)
        : (player2Choice = data.player1);

      let rowss = await getComponents(options);
      sent.edit({
        components: rowss,
        embeds: [
          {
            color: "DARK_VIVID_PINK",
            title: this.startTitle,
            description: getDescription(player1Choice, player2Choice),
          },
        ],
      });

      let win = getWinner(player1Choice, player2Choice);
      let winner = win === 1 ? message.author.username : player2.username;
      let loser = win === 2 ? message.author.username : player2.username;

      if (win === 0) {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_BUT_NOT_BLACK",
              title: this.drawEndTitle
                .replace(/\{player1\}/, message.author.username)
                .replace(/\{player2\}/, player2.username),
              description: this.drawEndDescription
                .replace(/\{player1\}/, message.author.username)
                .replace(/\{player2\}/, player2.username),
            },
          ],
        });
        ended = true;
        break;
      } else if (win >= 0 && win <= 2) {
        let r = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("no_need_of_id_here")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel("Game Ended")
            .setEmoji("🕊")
        );
        sent.edit({
          components: [r],
          embeds: [
            {
              color: "DARK_BUT_NOT_BLACK",
              title: this.endTitle
                .replace(/\{winner\}/, winner)
                .replace(/\{loser\}/, loser),
              description: this.endDescription
                .replace(/\{winner\}/, winner)
                .replace(/\{loser\}/, loser),
            },
          ],
        });
        ended = true;
        break;
      }
    }
    if (ended) return;
    let win = getWinner(user, botc);
    let winner = win === 1 ? message.author.username : player2.username;
    let loser = win === 2 ? message.author.username : player2.username;

    if (win === 0) {
      let r = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("no_need_of_id_here")
          .setDisabled(true)
          .setStyle("SECONDARY")
          .setLabel("Game Ended")
          .setEmoji("🕊")
      );
      sent.edit({
        components: [r],
        embeds: [
          {
            color: "DARK_BUT_NOT_BLACK",
            title: this.drawEndTitle
              .replace(/\{player1\}/, message.author.username)
              .replace(/\{player2\}/, player2.username),
            description: this.drawEndDescription
              .replace(/\{player1\}/, message.author.username)
              .replace(/\{player2\}/, player2.username),
          },
        ],
      });
      ended = true;
    } else if (win >= 0 && win <= 2) {
      let r = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("no_need_of_id_here")
          .setDisabled(true)
          .setStyle("SECONDARY")
          .setLabel("Game Ended")
          .setEmoji("🕊")
      );
      sent.edit({
        components: [r],
        embeds: [
          {
            color: "DARK_BUT_NOT_BLACK",
            title: this.endTitle
              .replace(/\{winner\}/, winner)
              .replace(/\{loser\}/, loser),
            description: this.endDescription
              .replace(/\{winner\}/, winner)
              .replace(/\{loser\}/, loser),
          },
        ],
      });
      ended = true;
    }
  }
}

module.exports = TicTacToe;
