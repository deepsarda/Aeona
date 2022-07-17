const { MessageAttachment } = require("discord.js");
const { Triggered } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "trigger",
  description: "Trigger someone!",
  usage: "+trigger [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Triggered().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.gif");

    options = {
      title: `${member.displayName} was triggered!`,
      imageURL: "attachment://image.gif",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
