const Discord = require("discord.js");

const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
const parseUser = require("../../utils/parseUser.js");
const { success, emotes } = require("../../utils/resources.js");

module.exports = {
  name: "inventory",
  description: "See all your inventory",
  usage: "+inventory",
  category: "economy",
  requiredArgs: 0,
  aliases: ["inv"],
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    let profile = await bot.economy.getConfig(user);
    let page = 0;

    //Split the profile.items into pages of 5
    let items = [];
    for (let i = 0; i < profile.items.length; i++) {
      if (i % 5 == 0) {
        items.push([]);
      }
      items[items.length - 1].push(profile.items[i]);
    }

    //If there are no items, return an error
    if (items.length == 0)
      return await message.replyError({
        msg: message,
        title: "You don't have any items!",
        description: `You can buy items from the shop, by using \`${prefix}shop\``,
      });

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
    let embed = await generateEmbed(
      message,
      page,
      items[page],
      items.length,
      user
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
        if (page == items.length - 1) {
          return;
        }
        //Increment the page
        page++;

        //Send the next page
        embed = await generateEmbed(
          message,
          page,
          items[page],
          items.length,
          user
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
          items[page],
          items.length,
          user
        );
        i.update({ embeds: [embed] });
      }
    });
  },
};

// async function generateEmbed(message, page, items, totalPages, user) {
//   let description = "";
//   //Loop through the items
//   for (let i = 0; i < items.length; i++) {
//     let item = message.client.economy.getItem(items[i].name);

//     description += ` \n  ${item.emote} **${item.name}** x  ${
//       items[i].amount
//     }  \n ${item.description} ${
//       items[i].level ? "level: " + items[i].level : ""
//     } \n`;
//   }

//   description += `\n Page ${page + 1} of ${totalPages}`;

//   return await success.embed({
//     msg: message,
//     title: `${user.displayName}'s Inventory`,
//     description: description,
//   });
// }

const generateEmbed = async (message, page, items, totalPages, user) => {
  let embedDescription = "";

  for (let [index, item] of items.entries()) {
    item = message.client.economy.getItem(item.name);

    const [name, description] = item.description.split("\n");
    const emote = item.emote;
    const amount = items[index].amount;

    embedDescription += `${emote} ${name} → ${amount}\n${emotes.downRightArrow} ${description}\n\n`;
  }

  embedDescription += `${emotes.divider} Page ${page + 1} of ${totalPages}`;

  return await success.embed({
    embed: true,
    title: `${user.displayName}'s Inventory`,
    description: embedDescription,
    thumbnailURL: "https://img.icons8.com/dusk/344/in-inventory.png",
  });
};
