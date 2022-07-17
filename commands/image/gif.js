const { MessageAttachment } = require("discord.js");
const { Blink } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "gif",
  aliases: ["makegif"],
  description: "Turn a bunch of URLs into gifs",
  usage: "+gif <URL-1, URL-2...>",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new Blink().getImage(...args.split(", "));
    const attach = new MessageAttachment(url, "image.gif");

    await message.reply({
      title: `Here is your GIF!`,
      imageURL: "attachment://image.gif",
      files: [attach],
    });
  },
};
