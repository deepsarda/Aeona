const { MessageAttachment } = require("discord.js");
const { Thomas } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "thomas",
  description: "Turn someone's avatar into Thomas the Tank Engine's face",
  usage: "+thomas [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Thomas().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `Say hello to ${member.displayName} the Tank Engine`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
