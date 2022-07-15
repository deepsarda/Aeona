const ms = require("ms");

module.exports = {
  name: "remind",
  description: "Create a reminder",
  usage: "+remind <time> <message>",
  category: "utility",
  requiredArgs: 2,
  execute: async (message, args, bot, prefix) => {
    let time = args[0];
    let reminder = args.slice(1).join(" ");

    if (!ms(time))
      return message.replyError({
        title: "REMINDER",
        description:
          "You must include a time for your reminder! \n Correct usage: `+remind <time> <message>` \n Example: `+remind 10min Check on food` ",
      });

    if (ms(time) < ms("10s"))
      return message.replyError({
        title: "REMINDER",
        description: "The time must be more than 10 seconds!",
      });

    if (ms(time) > ms("1hr"))
      return message.replyError({
        title: "REMINDER",
        description: "The time must be less than 1 hour!",
      });

    message.reply("Okay! I'll remind you in " + time + "!");
    setTimeout(() => {
      try {
        message.author.send(reminder);
      } catch (e) {
        message.channel.send(
          "I couldn't send the reminder to you! Please make sure you have DMs enabled! \n **But your reminder has ended!** \n **Reason:** " +
            reaason
        );
      }
    }, ms(time));
  },
};
