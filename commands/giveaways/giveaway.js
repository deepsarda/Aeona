const ms = require('ms');

module.exports = {
  name: "giveaway",
  description: "Start a giveaway!",
  aliases: ["start-giveaway", "giveaway-start"],
  usage: "+giveaway <duration> <winners> <prize>",
  category: "giveaways",
  requiredArgs: 3,
  execute: async (message, args, bot, prefix) => {

    const duration = args[0];
    const winnerCount = Number(args[1]);
    const prize = args.slice(2).join(" ");
    
    await bot.giveawaysManager.start(message.channel, {
      duration: ms(duration),
      winnerCount,
      prize
    });
  },
};
