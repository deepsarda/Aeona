const { MessageAttachment } = require("discord.js");
const { Ad } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "ad",
  description: "Turn someone's avatar into an advertisement!",
  usage: "+ad [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Ad().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `${member.displayName}'s avatar is now an advert!`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
