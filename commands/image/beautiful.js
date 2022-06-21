const { MessageAttachment } = require("discord.js");
const { Beautiful } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "beautiful",
  description: "A beautiful avatar!",
  usage: "+beautiful [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Beautiful().getImage(member.displayAvatarURL({ dynamic: false, format: 'png', size: 2048 }));
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `${member.displayName}'s avatar is beautiful!`,
      imageURL: "attachment://image.png",
      files: [attach]
    };

    if (member.id !== message.author.id)
      options.content = `${member}`;

    await message.channel.send(options);
  },
};