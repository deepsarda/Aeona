const ms = require("ms");
const Discord = require("discord.js");
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
    if (!duration)
      return message.reply(
        `${message.member}, you need to specify a duration!`
      );

    if (!winnerCount)
      return message.reply(
        `${message.member}, you need to specify a winner count!`
      );

    if (!prize)
      return message.reply(`${message.member}, you need to specify a prize!`);

    await bot.giveawaysManager.start(message.channel, {
      duration: ms(duration),
      winnerCount,
      prize: `:tada: Giveaway: ${prize}!`,
      hostedBy: message.member,
      embedColor: 5793266,
      embedColorEnd: 16711680,
      thumbnail: bot.user.displayAvatarURL(),
      messages: {
        winMessage: {
          content: `{winners} ${message.member}`,
          embed: new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `:tada: Congratulations, {winners}! You won **{this.prize}**!\n[Jump to giveaway!]({this.messageURL})`
            ),
        },
        embedFooter: {
          text: `{this.winnerCount} winner(s)`,
          iconURL: bot.user.displayAvatarURL(),
        },
        noWinner: `> 💢 ** Giveaway cancelled, no valid participations!**\n`,
        drawing: `\n• ⏳ Drawing winner {timestamp}`,
        hostedBy: `• Hosted by ${message.member}`,
        winners: "winner(s)",
        endedAt: "Ended at",
      },
    });
  },
};
