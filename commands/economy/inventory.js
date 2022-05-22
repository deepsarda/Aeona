const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "inventory",
      description: "View your inventory",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
    const user =
      message.mentions.members.first() &&
      message.mentions.members.filter(
        (m) => args[0] && args[0].includes(m.user.id)
      ).size >= 1
        ? message.mentions.members
            .filter((m) => args[0] && args[0].includes(m.user.id))
            .first()
        : false ||
          message.guild.members.cache.get(args[0]) ||
          (args.length > 0 &&
            message.guild.members.cache.find((m) =>
              m.user.username
                .toLowerCase()
                .includes(args.join(" ").toLowerCase())
            )) ||
          message.member;

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
    if (items.length == 0) {
      util.error({
        msg: message,
        title: "You don't have any items.",
        description: "You can buy items with `" + prefix + "shop`.",
      });
      return;
    }

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
      items[page],
      items.length,
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
          items[page],
          items.length,
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
    title: "Your inventory",
    description: description,
  });
}
