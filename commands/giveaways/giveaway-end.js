const ms = require('ms');

module.exports = {
  name: "giveaway-end",
  description: "Start a giveaway!",
  aliases: ["gend", "end-giveaway"],
  usage: "+giveaway-end <giveaway id/giveaway prize>"",
  category: "giveaways",
  requiredArgs:1,
  execute: async (message, args, bot, prefix) => {
  const query = args.join(" ");
     if (!query) {
     }
  },
};
