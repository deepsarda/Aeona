const { MessageAttachment } = require("discord.js");
const { Wanted } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "wanted",
  description: "Make a wanted poster of someone",
  usage: "+wanted [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Wanted().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 }),
      "⌭"
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `${member.displayName} is wanted, dead or alive!`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
