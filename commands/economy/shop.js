const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "shop",
      description: "See the shop",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let items = bot.economy.getItems();

    //Filter out items that can't be used
    items = items.filter((item) => {
      return item.displayOnShop;
    });
    //Split the items into pages of 5
    let pages = [];
    for (let i = 0; i < items.length; i++) {
      if (i % 5 == 0) {
        pages.push([]);
      }
      pages[pages.length - 1].push(items[i]);
    }

    //If there are no items, return an error
    if (pages.length == 0) {
      util.error({
        msg: message,
        title: "There are no items.",
        description: "You can buy items with `" + prefix + "shop`.",
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

    //Send the first page
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
      componentType: "BUTTON",
      time: 10 * 60 * 1000,
    });
    collector.on("collect", async (i) => {
      //If the user clicks the next button
      if (i.customId == "next_page") {
        //If the user is on the last page, return an error
        if (page == pages.length - 1) {
          return;
        }

        //Increment the page
        page++;

        //Send the next page
        embed = await generateEmbed(
          message,
          page,
          pages[page],
          pages.length,
          util
        );
        i.update({ embeds: [embed] });
      }

      //If the user clicks the last button
      if (i.customId == "last_page") {
        //If the user is on the first page, return an error
        if (page == 0) {
          return;
        }

        //Decrement the page
        page--;

        //Send the last page
        embed = await generateEmbed(
          message,
          page,
          pages[page],
          pages.length,
          util
        );
        i.update({ embeds: [embed] });
      }
    });
  }
};

async function generateEmbed(message, page, items, totalPages, util) {
  let description = "";
  //Loop through the items
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    description += ` \n  ${item.emote}  ${
      item.description
    } - ${item.price.toLocaleString()} \n`;
  }

  description += `\n Page ${page + 1} of ${totalPages}`;
  return await util.success({
    msg: message,
    embed: true,
    title: "Shop",
    description: description,
  });
}
