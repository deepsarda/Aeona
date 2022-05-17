/**
 * An module to convert emoji to string
 * @param {String} emoji
 * @returns {Number} emoji's number representative
 */
function getNumber(emoji) {
  const e = [...emoji].map((x) => x.charCodeAt());
  if (e[1] !== 65039 || e[2] !== 8419 || e[0] < 48 || e[0] > 57) return emoji;
  return e[0] - 48;
}

module.exports = getNumber;
