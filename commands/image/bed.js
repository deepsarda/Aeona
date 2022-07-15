const { MessageAttachment } = require("discord.js");
const { Bed } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "bed",
  aliases: ["bedmonster", "bed-monster", "monster"],
  description: "Theres a monster under my bed!",
  usage: "+bed <@user>",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    if (member.id === message.author.id)
      return await message.replyError({
        title: "Oops!",
        description: `You need to ping someone else as well!\nCorrect Usage \`${prefix}bed <@user>\``,
      });

    const url = await new Bed().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `There's a monster under ${message.member.displayName}'s bed!`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
