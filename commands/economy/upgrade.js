const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "upgrade",
  description: "Upgrade your items. \n **Cost** \n Upto to level 20 - 10,000 credits \n Upto level 50 - 20,000 credits \n Up to level 100 - 50,000 credits \n Upto level 200 - 100,000 credits \n Upto level 300 - 200,000 credits \n Upto level 400 - 300,000 credits \n Upto level 500 - 400,000 credits \n Upto level 600 - 500,000 credits \n Upto level 700 - 600,000 credits \n Upto level 800 - 700,000 credits \n Upto level 900 - 800,000 credits \n Upto level 1,000 - 900,000 credits \n Upto level 1,100 - 1,000,000 credits \n Upto level 1,200 - 1,100,000 credits \n Upto level 1,300 - 1,200,000 credits \n Upto level 1,400 - 1,300,000 credits \n Upto level 1,500 - 1,400,000 credits \n Upto level 1,600 - 1,500,000 credits \n Upto level 1,700 - 1,600,000 credits \n Upto level 1,800 - 1,700,000 credits \n Upto level 1,900 - 1,800,000 credits \n Upto level 2,000 - 1,900,000 credits \n Upto level 2,100 - 2,000,000 credits \n Upto level 2,200 - 2,100,000 credits \n Upto level 2,300 - 2,200,000 credits \n Upto level 2,400 - 2,300,000 credits \n Upto level 2,500 - 2,400,000 credits \n Above that - 2,500,000 credits",
  category: "economy",
  usage: "+upgrade [item] [amount](optional)",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {

    let item = args[0];
    let amount = numberParse(args[1]);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);
    if (!itemData) {
      message.replyError({
        msg: message,
        title: "Item not found.",
      });
      return;
    }

    //find if user has item.
    let itemUser = bot.economy.getItemFromArray(profile.items, itemData.name);
    if (!itemUser) {
      message.replyError({
        msg: message,
        title: "You don't have this item.",
      });
      return;
    }

    itemUser = itemUser.item;
    let copy = itemUser;
    if (!itemData.upgradeAble) {
      message.replyError({
        msg: message,
        title: "This item cannot be upgraded.",
      });
      return;
    }

    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        let level = itemUser.level ? itemUser.level : 1;
        let m = false;
        while(true){
            let cost = await getUpgradeCost(level);
            if (cost > profile.coinsInWallet) {
                break;
            }
            if (cost > 0) {
                profile.coinsInWallet -= cost;
                itemUser.level = level;
                itemUser.level += 1;
                m = true;
            } else {
                break;
            }
            level += 1;
        }


        profile.items.splice(profile.items.indexOf(copy), 1);
        profile.items.push(itemUser);
        await profile.save();
        message.reply({
          msg: message,
          title: `You upgraded ${itemData.name} to level ${level}!`,
          description: `You now have ${profile.coinsInWallet.toLocaleString()} credits.`,
        });
      }
      return;
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });


    let level = itemUser.level ? itemUser.level : 1;
    while(true){
        let cost = await getUpgradeCost(level);
        if (cost > profile.coinsInWallet) {
            message.replyError({
            msg: message,
            title: "You don't have enough money.",
            description: `You need ${(
                cost - profile.coinsInWallet
            ).toLocaleString()} more credits.`,
            });
            return;
        }
        if (cost > 0) {
            profile.coinsInWallet -= cost;
            itemUser.level = level;
            itemUser.level += 1;
            m = true;
        } else {
            break;
        }
        level += 1;
    }

    //Save itemUser
    //remove item from profile

    profile.items.splice(profile.items.indexOf(copy), 1);
    profile.items.push(itemUser);
    await profile.save();

    message.reply({
      msg: message,
      title: `You upgraded ${itemData.name} to level ${level}!`,
      description: `You now have ${profile.coinsInWallet.toLocaleString()} credits.`,
    });

  },
};


async function getUpgradeCost(level) {
    //**Cost** \n Upto to level 20 - 10,000 credits \n Upto level 50 - 20,000 credits \n Up to level 100 - 50,000 credits \n Upto level 200 - 100,000 credits \n Upto level 300 - 200,000 credits \n Upto level 400 - 300,000 credits \n Upto level 500 - 400,000 credits \n Upto level 600 - 500,000 credits \n Upto level 700 - 600,000 credits \n Upto level 800 - 700,000 credits \n Upto level 900 - 800,000 credits \n Upto level 1,000 - 900,000 credits \n Upto level 1,100 - 1,000,000 credits \n Upto level 1,200 - 1,100,000 credits \n Upto level 1,300 - 1,200,000 credits \n Upto level 1,400 - 1,300,000 credits \n Upto level 1,500 - 1,400,000 credits \n Upto level 1,600 - 1,500,000 credits \n Upto level 1,700 - 1,600,000 credits \n Upto level 1,800 - 1,700,000 credits \n Upto level 1,900 - 1,800,000 credits \n Upto level 2,000 - 1,900,000 credits \n Upto level 2,100 - 2,000,000 credits \n Upto level 2,200 - 2,100,000 credits \n Upto level 2,300 - 2,200,000 credits \n Upto level 2,400 - 2,300,000 credits \n Upto level 2,500 - 2,400,000 credits \n Above that - 2,500,000 credits

    if(level < 20)
        return 10000;
    
    if(level < 50)
        return 20000;
    
    if(level < 100)
        return 50000;
    
    if(level < 200)
        return 100000;
    
    if(level < 300)
        return 200000;
    
    if(level < 400)
        return 300000;
    
    if(level < 500)
        return 400000;
    
    if(level < 600)
        return 500000;
    
    if(level < 700)
        return 600000;
    
    if(level < 800)
        return 700000;
    
    if(level < 900)
        return 800000;
    
    if(level < 1000)
        return 900000;
    
    if(level < 1100)
        return 1000000;
    
    if(level < 1200)
        return 1100000;
    
    if(level < 1300)
        return 1200000;
    
    if(level < 1400)
        return 1300000;
    
    if(level < 1500)
        return 1400000;
    
    if(level < 1600)
        return 1500000;
    
    if(level < 1700)
        return 1600000;
    
    if(level < 1800)
        return 1700000;
    
    if(level < 1900)
        return 1800000;
    
    if(level < 2000)
        return 1900000;
    
    if(level < 2100)
        return 2000000;
    
    if(level < 2200)
        return 2100000;
    
    if(level < 2300)
        return 2200000;
    
    if(level < 2400)
        return 2300000;
    
    if(level < 2500)
        return 2400000;
    
    return 2500000;
}