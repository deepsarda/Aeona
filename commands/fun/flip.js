module.exports = {
  name: "flip",
  description: "Flip a coin!",
  aliases: ["cointoss"],
  usage: "+flip",
  category: "fun",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const m = await message.reply({
      title: "Flipping a coin...",
    });

    const sides = ["Heads", "Tails"];

    await m.edit({
      title: "Coin flipped!",
      description: `The coin landed on ${sides[Math.round(Math.random())]}`,
    });
  },
};
