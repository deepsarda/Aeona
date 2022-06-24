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
      messages: {
        giveaway: " ",
        giveawayEnded: " ",
        inviteToParticipate: `> **React with ${client.bot_emojis.giveaway} to participate!**`,
        winMessage: { content: "", embed: new MessageEmbed().setColor("GREEN").setDescription(`:tada: Congratulations, {winners}! You won **{this.prize}**!\n[Jump to giveaway!]({this.messageURL})`) },
        embedFooter: { text: `{this.winnerCount} winner(s)`, iconURL: client.user.displayAvatarURL() },
        noWinner: `> 💢 ** Giveaway cancelled, no valid participations!**\n`,
        drawing: `\n• ⏳ Drawing winner {timestamp}`,
        hostedBy: `• Hosted by ${message.author}`,
        winners: "winner(s)",
        endedAt: "Ended at",
       },
    });
  },
};
