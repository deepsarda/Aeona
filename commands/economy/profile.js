const Discord = require("discord.js");

const numberParse = require("../../utils/numberParse");
const parseUser = require("../../utils/parseUser.js");
const randint = require("../../utils/randint");

module.exports = {
  name: "profile",
  description: "View your profile",
  category: "economy",
  usage: "+profile [@user]",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const mentionUser = parseUser(message, args);
    let user = await bot.economy.getConfig(mentionUser);

    await message.reply({
      title: `${mentionUser.displayName}'s Profile`,
      thumbnailURL: mentionUser.displayAvatarURL({ dynamic: true }),
      fieldNames: ["Wallet", "Bank"],
      fieldValues: [
        `⌭ ${user.coinsInWallet.toLocaleString()}`,
        `⌭ ${user.coinsInBank.toLocaleString()} / ${user.bankSpace.toLocaleString()}`,
      ],
    });
  },
};
