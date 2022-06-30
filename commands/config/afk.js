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
    if (userr) return message.channel.send(`Please do not mention users.`);

    let everyoneping = args.indexOf("@everyone") > -1;
    let hereping = args.indexOf("@here") > -1;

    if (everyoneping || hereping)
      return message.channel.send(`Please do not ping everyone or here.`);

    if (args.length > 100) {
      return message.channel.send(
        `Please keep your AFK message under 100 words.`
      );
    }

    let content = args.join(" ") || "AFK";

    const afklist = await Afk.findOne({ userID: message.member.id });
    await message.member.setNickname(nickname).catch(() => {});

    const newafk = new Afk({
      userID: message.author.id,
      serverID: message.guild.id,
      reason: content,
      oldNickname: oldNickname,
      time: new Date(),
    });
    await newafk.save();

    return message.channel.send({
      title: "AFK",
      description: `You are now AFK.`,
      thumbnailURL: message.member.displayAvatarURL({ dynamic: true }),
    });
  },
};
