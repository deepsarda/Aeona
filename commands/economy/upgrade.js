const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "upgrade",
  description: "Upgrade your items. ",
  category: "economy",
  usage: "+upgrade <item> [amount]",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let item = args[0];
    let amount = numberParse(args[1]);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);

    const upgradeURL = "https://img.icons8.com/dusk/344/upgrade.png";

    if (!itemData)
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description:
          "That item could not be found!\nPlease retry this command.",
      });

    //find if user has item.
    let itemUser = bot.economy.getItemFromArray(profile.items, itemData.name);

    if (!itemUser)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like you don't have this item!\nPlease retry this command.",
      });

    itemUser = itemUser.item;
    let copy = itemUser;

    if (!itemData.upgradeAble)
      return await message.replyError({
        title: "Oops!",
        description:
          "This item cannot be upgraded!\nPlease retry this command.",
      });

    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        let level = itemUser.level ? itemUser.level : 1;
        console.log("EEEE");
        while (true) {
          let cost = getUpgradeCost(level);

          if (cost > profile.coinsInWallet) {
            break;
          }
          if (cost > 0) {
            profile.coinsInWallet = profile.coinsInWallet - cost;
            level += 1;
            itemUser.level = level;
          } else {
            break;
          }
        }

        profile.items.splice(profile.items.indexOf(copy), 1);
        profile.items.push(itemUser);

        await profile.save();

        await message.reply({
          title: "You upgraded an item!",
          description: `You upgraded ${
            itemData.name
          } to level ${level}!\nYou now have ⌭ ${profile.coinsInWallet.toLocaleString()} remaining in your wallet.`,
          thumbnailURL: upgradeURL,
        });
      }
      return;
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ title: "Invalid amount!" });

    let level = itemUser.level ? itemUser.level : 1;
    while (true) {
      let cost = getUpgradeCost(level);
      if (cost > profile.coinsInWallet) {
        return await message.replyError({
          msg: message,
          title: "Oops!",
          description: `Looks like you don't have enough money... you need ⌭ ${(
            cost - profile.coinsInWallet
          ).toLocaleString()} more to upgrade your item!\nPlease retry this command.`,
        });
      }
      if (cost > 0) {
        profile.coinsInWallet = profile.coinsInWallet - cost;
        level += 1;
        itemUser.level = level;
      } else {
        break;
      }
    }

    //Save itemUser
    //remove item from profile

    profile.items.splice(profile.items.indexOf(copy), 1);
    profile.items.push(itemUser);
    await profile.save();

    await message.reply({
      title: "You upgraded an item!",
      description: `You upgraded ${
        itemData.name
      } to level ${level}!\nYou now have ⌭ ${profile.coinsInWallet.toLocaleString()} remaining in your wallet.`,
      thumbnailURL: upgradeURL,
    });
  },
};

function getUpgradeCost(level) {
  //**Cost** \n Upto to level 20 - 10,000 credits \n Upto level 50 - 20,000 credits \n Up to level 100 - 50,000 credits \n Upto level 200 - 100,000 credits \n Upto level 300 - 200,000 credits \n Upto level 400 - 300,000 credits \n Upto level 500 - 400,000 credits \n Upto level 600 - 500,000 credits \n Upto level 700 - 600,000 credits \n Upto level 800 - 700,000 credits \n Upto level 900 - 800,000 credits \n Upto level 1,000 - 900,000 credits \n Upto level 1,100 - 1,000,000 credits \n Upto level 1,200 - 1,100,000 credits \n Upto level 1,300 - 1,200,000 credits \n Upto level 1,400 - 1,300,000 credits \n Upto level 1,500 - 1,400,000 credits \n Upto level 1,600 - 1,500,000 credits \n Upto level 1,700 - 1,600,000 credits \n Upto level 1,800 - 1,700,000 credits \n Upto level 1,900 - 1,800,000 credits \n Upto level 2,000 - 1,900,000 credits \n Upto level 2,100 - 2,000,000 credits \n Upto level 2,200 - 2,100,000 credits \n Upto level 2,300 - 2,200,000 credits \n Upto level 2,400 - 2,300,000 credits \n Upto level 2,500 - 2,400,000 credits \n Above that - 2,500,000 credits

  if (level < 20) return 1000;

  if (level < 50) return 2000;

  if (level < 100) return 5000;

  if (level < 200) return 10000;

  if (level < 300) return 20000;

  if (level < 400) return 30000;

  if (level < 500) return 40000;

  if (level < 600) return 50000;

  if (level < 700) return 60000;

  if (level < 800) return 70000;

  if (level < 900) return 80000;

  if (level < 1000) return 90000;

  if (level < 1100) return 100000;

  if (level < 1200) return 110000;

  if (level < 1300) return 120000;

  if (level < 1400) return 130000;

  if (level < 1500) return 140000;

  if (level < 1600) return 150000;

  if (level < 1700) return 160000;

  if (level < 1800) return 170000;

  if (level < 1900) return 180000;

  if (level < 2000) return 190000;

  if (level < 2100) return 200000;

  if (level < 2200) return 210000;

  if (level < 2300) return 220000;

  if (level < 2400) return 230000;

  if (level < 2500) return 240000;

  return 250000;
}
