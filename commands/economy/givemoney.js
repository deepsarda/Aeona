const Discord = require("discord.js");

const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "givemoney",
  description: "Give credits to another user",
  usage: "+givemoney <@user> <amount>",
  category: "economy",
  requiredArgs: 2,
  aliases: ["donate", "givecredits", "give-money", "give-credits"],
  execute: async (message, args, bot, prefix) => {
    const user = message.member;
    const user2 = parseUser(message, args);

    let profile = await bot.economy.getConfig(user);
    let amount = Number(args[1]);

    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all")
        amount = profile.coinsInWallet;
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return await message.replyError({ title: "Invalid amount!" });

    if (amount > profile.coinsInWallet)
      return await message.replyError({
        title: "You don't have those many credits.",
        description: `You need ${(
          amount - profile.coinsInWallet
        ).toLocaleString()} more credits.`,
      });

    if (profile.passive)
      return await message.replyError({
        title: "You can't use this command while passive.",
      });

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle("SUCCESS")
    );

    const m = await message.reply({
      title: "Confirm this action to proceed",
      description: `Are you sure you want to give ⌭ ${amount} to ${user2}?\n\nClick on the **Confirm** button to confirm your decision.`,
      components: [row],
    });

    const collector = m.createMessageComponentCollector({
      time: 15000,
      max: 1,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "confirm") {
        let profile2 = await bot.economy.getConfig(user2);

        profile.coinsInWallet -= amount;
        profile2.coinsInWallet += amount;

        await profile2.save();
        await profile.save();

        await i.reply({
          title: `You gave credits to ${user2.displayName}!`,
          description: `You successfully sent ⌭ ${amount.toLocaleString()} to ${user2}!\nThank you for your kind offer ^^`,
          thumbnailURL: "https://img.icons8.com/fluency/344/tip.png",
        });
      }
    });
  },
};
