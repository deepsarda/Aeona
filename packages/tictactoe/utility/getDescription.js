const getEmoji = require("./getEmoji");

/**
 * A Module to get the description for the game
 * @param {Array<Number>} player1
 * @param {Array<Number>} player2
 * @returns
 */
function getDescription(player1, player2) {
  let string =
    "```\n-----------------\n| 1️⃣ | 2️⃣ | 3️⃣ |\n| 4️⃣ | 5️⃣ | 6️⃣ |\n| 7️⃣ | 8️⃣ | 9️⃣ |\n-----------------\n```";
  player1.forEach(
    (v, i) => (player1[i] = getEmoji(v) || getEmoji(player1[i]) === getEmoji(v))
  );
  player2.forEach(
    (v, i) => (player2[i] = getEmoji(v) || getEmoji(player2[i]) === getEmoji(v))
  );

  player1.forEach((v) => (string = string.replace(v, "❌")));
  player2.forEach((v) => (string = string.replace(v, "⭕")));

  return string;
}

module.exports = getDescription;
