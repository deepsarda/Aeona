const Discord = require("discord.js");

module.exports = function getComponents(timeout) {
  const rows = [new Discord.MessageActionRow()];
  let one = new Discord.MessageButton()
    .setLabel(this.oneName || "\u200b")
    .setDisabled(timeout.includes("one"))
    .setStyle(timeout.includes("one") ? "DANGER" : "PRIMARY")
    .setCustomId("1_fight_game");
  let two = new Discord.MessageButton()
    .setLabel(this.twoName || "\u200b")
    .setDisabled(timeout.includes("two"))
    .setStyle(timeout.includes("two") ? "DANGER" : "PRIMARY")
    .setCustomId("2_fight_game");
  let three = new Discord.MessageButton()
    .setLabel(this.threeName || "\u200b")
    .setDisabled(timeout.includes("three"))
    .setStyle(timeout.includes("three") ? "DANGER" : "PRIMARY")
    .setCustomId("3_fight_game");
  let four = new Discord.MessageButton()
    .setLabel(this.endName || "\u200b")
    .setDisabled(false)
    .setStyle("DANGER")
    .setCustomId("4_fight_game");

  if (this.options.oneEmoji) one.setEmoji(this.options.oneEmoji);
  if (this.options.twoEmoji) two.setEmoji(this.options.twoEmoji);
  if (this.options.threeEmoji) three.setEmoji(this.options.threeEmoji);
  if (this.options.endEmoji) four.setEmoji(this.options.endEmoji);

  rows[0].addComponents([one, two, three, four]);

  return rows;
};
