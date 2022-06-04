const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "rich",
  description: "See the richest users",
  category: "economy",
  usage: "+rich",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let users = await bot.economy.getAllConfigs();
    await message.guild.members.fetch();
    //Filter out non guild members
    users = users.filter(function (x) {
      return message.guild.members.cache.get(x.userId);
    });
    let sortedUsers = users.sort(
      (a, b) => b.coinsInWallet + b.coinsInBank - (a.coinsInWallet + a.coinsInBank)
    );

    let richUsers = sortedUsers.slice(0, 10);
    let description = "";
    const emojis = [":first_place:", ":second_place:", ":third_place:"];
    for (let i = 0; i < richUsers.length; i++) {
      let user = richUsers[i];
      let money = user.coinsInWallet + user.coinsInBank;
      description += `${emojis[i] || "🔹"} ${money.toLocaleString()}  → <@${
        user.userId
      }>\n`;
    }
    message.reply({
      msg: message,
      title: "Richest users",
      description: description,
    });
  },
};
