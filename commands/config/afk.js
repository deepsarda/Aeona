const Guild = require("../../database/schemas/Guild");
const Afk = require("../../database/schemas/afk");

module.exports = {
  name: "afk",
  description: "Set your AFK status",
  usage: "+afk",
  aliases: [],
  category: "config",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const oldNickname = message.member.nickname || message.author.username;
    const nickname = `[AFK] ${oldNickname}`;

    const userr = message.mentions.users.first();
    let everyoneping = args.indexOf("@everyone") > -1;
    let hereping = args.indexOf("@here") > -1;

    if (everyoneping || hereping || userr)
      return await message.replyError({
        title: `Oops!`,
        description:
          "AFK messages cannot not contain mentions.\nPlease retry this command.",
      });

    if (args.length > 100) {
      return await message.replyError({
        title: `Oops!`,
        description:
          "AFK messages cannot not exceed 100 words.\nPlease retry this command.",
      });
    }

    let content = args.join(" ") || "AFK";

    const afklist = await Afk.findOne({ userID: message.member.id });
    await message.member.setNickname(nickname).catch(() => {});

    await message.reply({
      title: "You went AFK!",
      description: `${message.member.displayName} is now AFK!\nMessage: ${content}`,
      thumbnailURL: message.member.displayAvatarURL({ dynamic: true }),
    });

    const newafk = new Afk({
      userID: message.author.id,
      serverID: message.guild.id,
      reason: content,
      oldNickname: oldNickname,
      time: new Date(),
    });
    await newafk.save();
  },
};
