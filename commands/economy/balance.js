const Discord = require("discord.js");

const { emotes } = require("../../utils/resources.js");
const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "balance",
  description: "View your balance",
  usage: "+balance [@user]",
  category: "economy",
  requiredArgs: 0,
  aliases: ["bal", "money"],
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    let profile = await bot.economy.getConfig(user);

    const wallet = profile.coinsInWallet.toLocaleString();
    const bank = profile.coinsInBank.toLocaleString();
    const worth = (
      profile.coinsInWallet + profile.coinsInBank
    ).toLocaleString();

    await message.reply({
      msg: message,
      userp: user,
      title: `${user.displayName}'s balance`,
      description: `${emotes.divider} **Wallet** → ⌭  ${wallet}\n${emotes.divider} **Bank** → ⌭ ${bank}\n${emotes.divider} **Worth** → ⌭ ${worth}`,
      thumbnailURL: "https://img.icons8.com/fluency/344/cash.png",
    });
  },
};
