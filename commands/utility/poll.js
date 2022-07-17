const emojiArray = require("../../structures/optionArray");
const pollModel = require("../../database/schemas/poll");
const squigglyRegex = RegExp(/{(.*?)}/);
const squareRegex = RegExp(/\[[^[]+\]/g);
const timeRegex = RegExp(/"(\d+(s|m|h|d|w))"/);
const moment = require("moment");
const ms = require("ms");

module.exports = {
  name: "poll",
  description: "Create a poll",
  usage:
    "+poll <time (optional)> {title} [option 1] [option 2] [option 3] **(Max 20)** ",
  category: "utility",
  requiredArgs: 1,
  botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
  premissions: ["MANAGE_MESSAGES"],
  execute: async (message, args, bot, prefix) => {
    const pollParameters = args.join(" ");
    const pollTitle = squigglyRegex.test(pollParameters)
      ? squigglyRegex.exec(pollParameters)[1]
      : null;
    if (!pollTitle)
      return await message.replyError({
        title: "POLL",
        description:
          "You must include a title for your poll! \n Correct usage: `+poll <time (optional)> {title} [option 1] [option 2] [option 3] **(Max 20)** ` \n Example: \n 1- `+poll 12hr {Is Aeona a good bot?} yes no \n 2- `+poll {Is Aeona a good bot?} [yes no]`",
      });

    pollParameters.replace(`{${pollTitle}}`, "");
    const pollsArray = pollParameters.match(squareRegex);
    if (!pollsArray)
      return await message.replyError({
        title: "POLL",
        description:
          "You must include a title for your poll! \n Correct usage: `+poll <time (optional)> {title} [option 1] [option 2] [option 3] **(Max 20)** ` \n Example: \n 1- `+poll 12hr {Is Aeona a good bot?} yes no \n 2- `+poll {Is Aeona a good bot?} [yes no]`",
      });

    if (pollsArray.length > 20)
      return await message.replyError({
        title: "POLL",
        description: "You can only have a maximum of 20 options!",
      });

    let i = 0;
    const pollString = pollsArray
      .map((poll) => `${emojiArray[i++]} ${poll.replace(/\[|\]/g, "")}`)
      .join("\n\n");

    const text = args.slice(0).join(" ");
    //console.log(text)
    const timedPoll = timeRegex.test(args[0])
      ? timeRegex.exec(args[0])[1]
      : null;
    const embed = {
      color: "BLUE",
      title: pollTitle,
      description: pollString,
      footer: {
        text: timedPoll
          ? `Ends at: <t:${Math.floor((Date.now() + ms(timedPoll)) / 1000)}:R>`
          : "",
      },
    };
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    let msg = await message.channel.send({ embed: embed }).catch(() => {});

    if (timedPoll) {
      if (guildDB.isPremium === "false") {
        if (msg) {
          msg.delete().catch(() => {});
        }
        message.channel.sendError({
          title: "POLL",
          description:
            "This server is not premium, so you can't create timed polls! [Buy premium](https://aeona.xyz/premium)",
        });

        return;
      }
    }

    const pollDoc = new pollModel({
      guild: message.guild.id,
      textChannel: message.channel.id,
      message: msg.id,
      expiryDate: Date.now() + ms(timedPoll),
      title: pollTitle,
    });

    await pollDoc.save();
    for (i = 0; i < pollsArray.length; i++) {
      await msg.react(emojiArray[i]).catch(() => {});
      await delay(750);
    }
  },
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
