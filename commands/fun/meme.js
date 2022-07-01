const { success, emotes } = require("../../utils/resources.js");
const Discord = require("discord.js");
module.exports = {
  name: "meme",
  description: "See a funny meme!",
  aliases: ["memes"],
  usage: "+meme",
  category: "fun",
  requiredArgs: 0,
  execute: async (message, args, client, prefix) => {
    var row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("next_page")
        .setEmoji(emotes.right)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle("SECONDARY")
    );

    var embed = await createEmbed(message);
    var msg = await message.reply({ embeds: [embed], components: [row] });
    var collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      idle: 60 * 1000,
    });
    collector.on("collect", async (i) => {
      if (i.customId == "next_page") {
        client.statcord.postCommand("meme", message.member.id);
        var embed = await createEmbed(message);
        i.update({ embeds: [embed] });
      }
      if (i.customId == "stop") {
        collector.stop();
      }
    });
  },
};

async function createEmbed(message) {
  var res = await fetch(`https://meme-api.herokuapp.com/gimme`);

  var data = await res.json();
  return await success.embed({
    msg: message,
    embed: true,
    title: data.title,
    description: "[Here is your meme](" + data.url + ")",
    imageURL: `${data.url}`,
  });
}
