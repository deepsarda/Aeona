const Discord = require("discord.js");

const numberParse = require("../../utils/numberParse");
const parseUser = require("../../utils/parseUser.js");
const randint = require("../../utils/randint");

module.exports = {
  name: "rob",
  description: "Rob a user",
  category: "economy",
  usage: "+rob <@user>",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let user = parseUser(message, args);

    let config = await bot.economy.getConfig(user);
    if (config.passive)
      return await message.replyError({
        msg: message,
        title: "Oops, that user is passive!",
        description: `Ah! Looks like ${user.displayName} is passive, which means he cannot be robbed...`,
      });

    let author = await bot.economy.getConfig(message.member);

    if (author.passive)
      return await message.reply({
        msg: message,
        title: "Oops, you are passive!",
        description: `You're passive, which means you can't rob anyone...\n\nDisable PASSIVE Mode using \`${prefix}passive\` before using this command.`,
      });

    let money = config.coinsInWallet;
    //meow
    if (money <= 0)
      return await message.replyError({
        msg: message,
        title: `Welp, we can't rob that user!`,
        description: `${user.displayName} has no money on hand to rob...`,
      });

    //Check for padlock

    let loot = ["nothing", "little", "half", "all"];
    let lootTable = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
    const padlock = config.items.find((x) => x.name === "padlock");
    if (padlock) {
      let array = config.items.filter((x) => x.name !== "padlock");
      if (Math.random() > 0.1) {
        if (padlock.amount > 1) {
          padlock.amount--;

          array.push(padlock);
          config.items = array;
          await config.save();
          message.reply({
            msg: message,
            title: `Oof! You couldn't rob ${user.displayName}`,
            description:
              "They have a padlock and which you break! Only to find one more!",
          });
          return;
        } else {
          config.items = array;
          await config.save();

          await message.reply({
            msg: message,
            title: `Oof! You couldn't rob ${user.displayName}`,
            description:
              "You tried robbing them, to find a padlock!\nYou broke the padlock... but had to get away.",
          });
        }
      } else {
        config.items = array;
        await config.save();
        await message.reply({
          msg: message,
          title: `Oof! You couldn't rob ${user.displayName}`,
          description:
            "You tried robbing them, to find a padlock!\nYou broke the padlock... but had to get away.",
        });
      }
    }

    if (config.items.find((x) => x.name == "luckyclover")) {
      const newInv = config.items.filter((i) => i.name != "luckyclover");
      const bypass = config.items.find((i) => i.name == "luckyclover");
      if (bypass.amount == 1) {
        user.items = newInv;
      } else {
        newInv.push({
          name: "luckyclover",
          amount: bypass.amount - 1,
          description: bypass.description,
        });
        config.items = newInv;
      }

      await config.save();
      lootTable = [1, 1, 2, 2, 2, 2, 3, 3, 3];
    }
    let lootIndex =
      loot[lootTable[Math.floor(Math.random() * lootTable.length)]];

    if (lootIndex == "nothing") {
      message.replyError({
        msg: message,
        title: "LMAO! You failed!",
        description: "You failed to rob the user.",
      });
      return;
    } else if (lootIndex == "little") {
      //Get between 0 and 50% of the money
      let percentage = Math.floor(Math.random() * 50);
      let robbedAmount = Math.floor(money * (percentage / 100));

      config.coinsInWallet -= robbedAmount;
      author.coinsInWallet += robbedAmount;
      await config.save();
      await author.save();

      await message.reply({
        msg: message,
        title: `Ha, You robbed ${user.displayName}!`,
        description: `You robbed ${percentage}% of ${
          user.displayName
        }'s money, which amounts to ⌭ ${robbedAmount.toLocaleString()}.`,
      });
    } else if (lootIndex == "half") {
      //Get half of the money
      let robbedAmount = Math.floor(money / 2);

      config.coinsInWallet -= robbedAmount;
      author.coinsInWallet += robbedAmount;
      await config.save();
      await author.save();
      message.reply({
        msg: message,
        title: `Ha, You robbed ${user.displayName}!`,
        description: `You robbed half of ${
          user.displayName
        }'s money, which amounts to ⌭ ${robbedAmount.toLocaleString()}.`,
      });
    } else if (lootIndex == "all") {
      //Get all the money
      let robbedAmount = money;

      config.coinsInWallet -= robbedAmount;
      author.coinsInWallet += robbedAmount;
      await config.save();
      await author.save();
      message.reply({
        msg: message,
        title: `Ha, You robbed ${user.displayName}!`,
        description: `You robbed all of ${
          user.displayName
        }'s money, which amounts to ⌭ ${robbedAmount.toLocaleString()}. RIP!`,
      });
    }
  },
};
