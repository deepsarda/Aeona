const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rich",
      description: "See the richest users",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
    let users = await bot.economy.getAllConfigs();
    await message.guild.members.fetch();
    //Filter out non guild members
    users = users.filter(function (x) {
      return message.guild.members.cache.get(x.userId);
    });
    let sortedUsers = users.sort(
      (a, b) => b.money.wallet + b.money.bank - (a.money.wallet + a.money.bank)
    );

    let richUsers = sortedUsers.slice(0, 10);
    let description = "";
    const emojis = [":first_place:", ":second_place:", ":third_place:"];
    for (let i = 0; i < richUsers.length; i++) {
      let user = richUsers[i];
      let money = user.money.wallet + user.money.bank;
      description += `${emojis[i] || "🔹"} ${money.toLocaleString()}  → <@${
        user.userId
      }>\n`;
    }
    util.success({
      msg: message,
      title: "Richest users",
      description: description,
    });
  }
};
