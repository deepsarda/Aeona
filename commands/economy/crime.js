const Discord = require("discord.js");

const { emotes } = require("../../utils/resources.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "crime",
  description: "Commit a crime",
  usage: "+crime",
  category: "economy",
  requiredArgs: 0,
  cooldown: 10 * 60,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const random = Math.round(Math.random() * 1000) + 10000;

    const randomMessage = [
      `You assassinated **Bill Gates** to be paid ⌭ ${random.toLocaleString()}.`,
      `You stole from a poor old granny, but she only had ⌭ ${random.toLocaleString()}.`,
      `You raided a drug dealer's home and found ⌭ ${random.toLocaleString()}.`,
      `You murdered **Donald Trump** to be paid ⌭ ${random.toLocaleString()}.`,
      `You almost got shot, but you had **GOD MODE** enabled and killed him.\nYou were paid ⌭ ${random.toLocaleString()}.`,
      `You stole from a rich businessman who had ⌭ ${random.toLocaleString()}.`,
      `You robbed a bank and looted ⌭ ${random.toLocaleString()}.`,
    ];
    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];

    bot.economy.giveUserCredits(message.member, random);

    await message.reply({
      msg: message,
      emote: emotes.alert,
      title: `You obtained a decent sum, illegally!`,
      description: response,
    });
  },
};
