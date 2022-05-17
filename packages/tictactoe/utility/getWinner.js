const getNumber = require("./getNumber");

/**
 *
 * @param {Array<Number>} player1
 * @param {Array<Number>} player2
 * @returns
 */
function getWinner(player1, player2) {
  player1.forEach((v, i) => (player1[i] = getNumber(v)));
  player2.forEach((v, i) => (player2[i] = getNumber(v)));

  if (
    (player1.includes(7) && player1.includes(5) && player1.includes(3)) ||
    (player1.includes(1) && player1.includes(5) && player1.includes(9)) ||
    (player1.includes(1) && player1.includes(2) && player1.includes(3)) ||
    (player1.includes(4) && player1.includes(5) && player1.includes(6)) ||
    (player1.includes(7) && player1.includes(8) && player1.includes(9)) ||
    (player1.includes(1) && player1.includes(4) && player1.includes(7)) ||
    (player1.includes(5) && player1.includes(2) && player1.includes(8)) ||
    (player1.includes(9) && player1.includes(2) && player1.includes(6)) ||
    (player1.includes(7) && player1.includes(5) && player1.includes(3))
  )
    return 1;
  else if (
    (player2.includes(1) && player2.includes(5) && player2.includes(9)) ||
    (player2.includes(7) && player2.includes(5) && player2.includes(3)) ||
    (player2.includes(1) && player2.includes(2) && player2.includes(3)) ||
    (player2.includes(4) && player2.includes(5) && player2.includes(6)) ||
    (player2.includes(7) && player2.includes(8) && player2.includes(9)) ||
    (player2.includes(1) && player2.includes(4) && player2.includes(7)) ||
    (player2.includes(5) && player2.includes(2) && player2.includes(8)) ||
    (player2.includes(9) && player2.includes(2) && player2.includes(6)) ||
    (player2.includes(7) && player2.includes(5) && player2.includes(3))
  )
    return 2;
  else if (player1.length + player2.length === 9) return 0;
  else return -1;
}

module.exports = getWinner;
