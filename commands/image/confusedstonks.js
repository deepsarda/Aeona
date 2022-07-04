const { MessageAttachment } = require("discord.js");
const { ConfusedStonk } = require("discord-image-generation");

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "confusedstonks",
  aliases: ["confusedstonk"],
  description: "Someone's making *confused*... stonks?",
  usage: "+confusedstonks [@user]",
  category: "image",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);

    const url = await new ConfusedStonk().getImage(
      member.displayAvatarURL({ dynamic: false, format: "png", size: 2048 })
    );
    const attach = new MessageAttachment(url, "image.png");

    options = {
      title: `Ah yes, ${member.displayName}'s making *confused* stonks?!`,
      imageURL: "attachment://image.png",
      files: [attach],
    };

    if (member.id !== message.member.id) options.content = `${member}`;

    await message.reply(options);
  },
};
