const { MessageAttachment } = require("discord.js");
const { Facepalm } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "facepalm",
  description: "Make someone facepalm",
  usage: "+facepalm [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Facepalm().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.gif");

    options = {
      title: `${member.displayName} !`,
      imageURL: "attachment://image.gif",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
