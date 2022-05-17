const { User } = require("discord.js");

/**
 *
 * @param {Result} result
 * @param {User} player1
 * @param {User} player2
 */
module.exports = function (result, player1, player2, player1move, player2move) {
  let content = "";

  result.P1damage = Math.abs(result.P1damage);
  result.P2damage = Math.abs(result.P2damage);

  // Add Data for Player 1.

  // When Successfuly move
  if (result.P1success) {
    content += `**${player1.username}** used \`${player1move}\` and `;
    if (result.P1move === 3 && result.P2move === 3)
      content += `healed themself with \`${result.P1damage}\` points, Because **${player2.username}** was also defending`;
    else if (result.P1move === 3 && result.P2move !== 3)
      content += `protected themself from **${player2.username}**'s \`${player2move}\` attack.`;
    else
      content += `damaged **${player2.username}** with ${result.P1damage} Points`;
  } // When failed Move
  else {
    if (result.P1move === 3 && result.P2move === 3)
      content += `${player1.username} was using ${player1move} but ended up loosing \`${result.P1damage}\` health points due to fear`;
    else if (result.P1move === 3 && result.P2move !== 3)
      content += `${player1.username} tried to use ${player1move} but failed in protecting themself from **${player2.username}**'s \`${player2move}\` attack and they lost ${result.P1damage} points`;
    else
      content += `${player1.username} failed in using \`${player1move}\` on **${player2.username}**, and it backfired hence a total damage of ${result.P1damage} on them`;
  }

  // Add Data for Player 2.

  // When Successfuly move
  if (result.P2success) {
    content += `\n\n**${player2.username}** used \`${player2move}\` and `;
    if (result.P1move === 3 && result.P2move === 3)
      content += `healed themself with \`${result.P2damage}\` points, Because **${player1.username}** was also defending`;
    else if (result.P2move === 3 && result.P1move !== 3)
      content += `protected themself from **${player1.username}**'s \`${player1move}\` attack.`;
    else
      content += `damaged **${player1.username}** with ${result.P2damage} Points`;
  } // When failed Move
  else {
    if (result.P2move === 3 && result.P1move === 3)
      content += `\n\n${player2.username} was using ${player2move} but ended up loosing \`${result.P2damage}\` health points due to fear`;
    else if (result.P2move === 3 && result.P1move !== 3)
      content += `\n\n${player2.username} tried to use ${player2move} but failed in protecting themself from **${player1.username}**'s \`${player1move}\` attack and they lost ${result.P2damage} points`;
    else
      content += `\n\n**${player2.username}** failed in using \`${player2move}\` on **${player1.username}**, and it backfired hence a total damage of ${result.P2damage} on **${player2.username}**`;
  }

  content += `\n\nNow\n**${player1.username}**'s health is **${
    result.P1health < 0 ? 0 : result.P1health
  }**\n**${player2.username}**'s health is **${
    result.P2health < 0 ? 0 : result.P2health
  }**`;

  return content;
};

/**
 * @typedef {Object} Result
 * @property {String} P1move
 * @property {Number} P1health
 * @property {Number} P1damage
 * @property {Boolean} P1success
 * @property {Array<String>} P1timeout
 * @property {String} P2move
 * @property {Number} P2health
 * @property {Number} P2damage
 * @property {Boolean} P2success
 * @property {Array<String>} P2timeout
 */
