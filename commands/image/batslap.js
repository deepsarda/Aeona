const { MessageAttachment } = require("discord.js");
const { Batslap } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "batslap",
  aliases: ["bslap", "b-slap", "bat-slap"],
  description: "Batslap someone",
  usage: "+batslap <@user>",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    if (member.id === message.author.id)
      return await message.replyError({
        title: "Oops!",
        description: `You need to ping someone else as well!\nCorrect Usage \`${prefix}batslap <@user>\``,
      });

    const url = await new Batslap().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `${member.displayName} got batslapped by ${message.member.displayName}`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
