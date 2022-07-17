const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
const { success, emotes } = require("../../utils/resources.js");

module.exports = {
  name: "shop",
  description: "See aeona's shop.",
  category: "economy",
  usage: "+shop",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
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
      message.replyError({
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
        .setEmoji(bot.emotes.left)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("next_page")
        .setEmoji(bot.emotes.right)
        .setStyle("PRIMARY")
    );

    //Send the first page
    let embed = await generateEmbed(message, page, pages[page], pages.length);
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
        embed = await generateEmbed(message, page, pages[page], pages.length);
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
        embed = await generateEmbed(message, page, pages[page], pages.length);
        i.update({ embeds: [embed] });
      }
    });
  },
};

async function generateEmbed(message, page, items, totalPages) {
  let description = "";
  //Loop through the items
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    description += ` \n  ${item.emote}  ${
      item.description
    } - ${item.price.toLocaleString()} \n`;
  }

  description += `\n Page ${page + 1} of ${totalPages}`;
  return await success.embed({
    msg: message,
    embed: true,
    title: "Shop",
    description: description,
  });
}
