const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "sell",
  description: "Sell your items.",
  category: "economy",
  usage: "+sell [item] [amount]",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    var user = message.member;
    var profile = await bot.economy.getConfig(user);
    let item1 = args[0];
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        item1 = null;
        amount = 1;
      }
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ title: "Invalid amount!" });

    const sellURL = "https://img.icons8.com/fluency/344/paid.png";

    if (!item1) {
      let moneyEarned = 0;
      let description = "";
      let itemsSold = 0;

      //Loop through all the items in the profile
      for (let i = 0; i < profile.items.length; i++) {
        let item = profile.items[i];
        let itemData = bot.economy.getItem(item.name);
        if (itemData.autosell) {
          moneyEarned += itemData.sellAmount * item.amount;
          description += `${itemData.emote} ${item.name
            .charAt(0)
            .toUpperCase()}${item.name.slice(
            1
          )} **x${item.amount.toLocaleString()}**\n`;
          itemsSold += item.amount;
          profile.items.splice(i, 1);
          i--;
        }
      }
      profile.coinsInWallet += moneyEarned;

      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle("SUCCESS")
      );

      const m = await message.reply({
        title: "Confirm this action to proceed",
        description: `Are you sure you want to sell the following items?\nClick on the **Confirm** button to confirm your decision.\n\n${description}`,
        components: [row],
      });

      const collector = m.createMessageComponentCollector({
        time: 15000,
        max: 1,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "confirm") {
          await profile.save();
          await i.reply({
            title: "You sold items!",
            description: `You sold the following ${itemsSold.toLocaleString()} items for ⌭ ${moneyEarned.toLocaleString()}\n\n${description}`,
            thumbnailURL: sellURL,
          });
        }
      });
      return;
    }
    let itemData = await bot.economy.getItem(item1);

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
    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = itemUser.amount;
      }
    }

    if (itemUser.amount < amount)
      return await message.replyError({
        title: "Oops!",
        description: `You don't have enough of this item... you need ${(
          amount - itemUser.amount
        ).toLocaleString()} more of it to be able to sell the amount you mentioned!\nPlease retry this command.`,
      });

    let sell = itemData.sellAmount * amount;
    profile.coinsInWallet += sell;
    await profile.save();
    bot.economy.takeUserItem(message.member, itemData.name, amount);

    await message.reply({
      title: "You sold some items!",
      description: `You sold ${
        itemData.name
      } **x${amount}** for ⌭ ${sell.toLocaleString()}.`,
      thumbnailURL: sellURL,
    });
  },
};
