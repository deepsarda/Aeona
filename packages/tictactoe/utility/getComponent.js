const Discord = require("discord.js");
const getEmoji = require("./getEmoji");

/**
 * A Module to get the components for the message
 * @param {Array<Number>} options
 * @returns
 */
async function getComponents(options) {
  const row1 = new Discord.MessageActionRow(),
    row2 = new Discord.MessageActionRow(),
    row3 = new Discord.MessageActionRow(),
    row4 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setStyle("DANGER")
        .setEmoji("❌")
        .setLabel("End Game")
        .setCustomId("0_tic_tac_toe")
    );
  let i = 1;

  for (; i < 4; i++)
    row1.addComponents(
      new Discord.MessageButton()
        .setCustomId(`${i}_tic_tac_toe`)
        .setStyle("PRIMARY")
        .setEmoji(getEmoji(i))
        .setDisabled(!options.includes(i))
    );
  for (; i < 7; i++)
    row2.addComponents(
      new Discord.MessageButton()
        .setCustomId(`${i}_tic_tac_toe`)
        .setStyle("PRIMARY")
        .setEmoji(getEmoji(i))
        .setDisabled(!options.includes(i))
    );
  for (; i < 10; i++)
    row3.addComponents(
      new Discord.MessageButton()
        .setCustomId(`${i}_tic_tac_toe`)
        .setStyle("PRIMARY")
        .setEmoji(getEmoji(i))
        .setDisabled(!options.includes(i))
    );

  return [row1, row2, row3, row4];
}

module.exports = getComponents;
