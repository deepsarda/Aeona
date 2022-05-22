const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ores",
      description: "See all the ores in the player inventory.",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);

    let ores = await bot.economy.getOres(message.member);
    if (!ores) {
      util.error({
        msg: message,
        title: "Ores",
        description: "You don't have any ores.",
      });
      return;
    }
    let pages = [];
    for (let i = 0; i < ores.length; i++) {
      if (i % 5 == 0) {
        pages.push([]);
      }
      pages[pages.length - 1].push(ores[i]);
    }
    if (pages.length == 0) {
      util.error({
        msg: message,
        title: "Ores",
        description: "You don't have any ores.",
      });
      return;
    }
    let page = 0;
    let row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("last_page")
        .setEmoji(util.emotes.left)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("next_page")
        .setEmoji(util.emotes.right)
        .setStyle("PRIMARY")
    );
    let embed = await generateEmbed(
      message,
      page,
      pages[page],
      pages.length,
      util
    );
    let msg = await message.reply({
      embeds: [embed],
      components: [row],
    });
    let collector = msg.createMessageComponentCollector({
      last: "last_page",
      next: "next_page",
    });
    collector.on("collect", async function (c) {
      if (c.customId == "last_page") {
        page = Math.max(0, page - 1);
      } else if (c.customId == "next_page") {
        page = Math.min(pages.length - 1, page + 1);
      }
      embed = await generateEmbed(
        message,
        page,
        pages[page],
        pages.length,
        util
      );
      msg.edit({
        embeds: [embed],
      });
    });
  }
};

async function generateEmbed(message, page, items, totalPages, util) {
  let description = "";
  //Loop through the items
  for (let i = 0; i < items.length; i++) {
    let item = message.client.economy.getItem(items[i].name);

    description += ` \n  ${item.emote} **${item.name}** x  ${
      items[i].amount
    }  \n ${item.description} ${
      items[i].level ? "level: " + items[i].level : ""
    } \n`;
  }

  description += `\n Page ${page + 1} of ${totalPages}`;
  return await util.success({
    msg: message,
    embed: true,
    title: "Ores",
    description: description,
  });
}
