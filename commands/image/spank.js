const { MessageAttachment } = require("discord.js");
const { Spank } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "spank",
  description: "Spank someone",
  usage: "+spank <@user>",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    if (member.id === message.author.id)
      return await message.replyError({
        title: "Oops!",
        description: `You need to ping someone else as well!\nCorrect Usage \`${prefix}spank <@user>\``,
      });

    const url = await new Spank().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `${member.displayName} got spanked by ${message.member.displayName}`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
