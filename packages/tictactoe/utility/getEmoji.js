/**
 * An module to convert number to emoji
 * @param {Number} number the number
 * @returns {String} The emoji representation of the number
 */
function getEmoji(number) {
  if (number > 9 || number < 1) return number;
  return String.fromCharCode(48 + number, 65039, 8419);
}

module.exports = getEmoji;
