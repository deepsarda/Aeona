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
    if(!duration)
      return message.channel.send(`${message.author}, you need to specify a duration!`);
    
    if(!winnerCount)
      return message.channel.send(`${message.author}, you need to specify a winner count!`);

    if(!prize)
      return message.channel.send(`${message.author}, you need to specify a prize!`);
    

  
    await bot.giveawaysManager.start(message.channel, {
      duration: ms(duration),
      winnerCount,
      prize,
      hostedBy: message.author,
      
    });
  },
};
