const { success, emotes } = require("../../utils/resources.js");
const Discord = require("discord.js");

const caps = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const getPage = async (bot, category, page) => {
  const commands = bot.categories
    .get(category)
    .commands.slice(page * 7, (page + 1) * 7 - 1);
  let description = "";

  for (const command of commands) {
    description += `${emotes.dot} \`${command.usage}\` → ${command.description}\n`;
  }

  const embed = await success.embed({
    embed: true,
    title: `${caps(category)} Commands`,
    description: description,
    footerText: `Page ${page + 1} of ${Math.ceil(
      bot.categories.get(category).commands.length / 7
    )}`,
  });
  return embed;
};

const getNumberOfPages = (bot, category) => {
  return Math.ceil(bot.categories.get(category).commands.length / 7);
};

module.exports = {
  name: "help",
  description: "View a list of all commands",
  usage: "+help <category>",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {


    let modules = "";
    let description = "**Use the dropdown to select the category to learn more about a command.** "
    let options = [];
    let fieldNames = [];
    let fieldValues = [];
    let inlines = [];
    for (const category of bot.categories.keys()) {
      let c = bot.categories.get(category);

      console.log(category);
      options.push({
        value: category,
        label: caps(category),
        emoji: c.info.emoji,
        description: c.info.label,
      });
      fieldNames.push(`${bot.categories.get(category).info.emoji}・${caps(
        category
      )}`);
      fieldValues.push(`${bot.categories.get(category).info.label}`);
      inlines.push(true);

    }

    const embed = await success.embed({
      embed: true,
      title: "Help menu",
      description: `Select a module using the dropdown below, to view **it's tutorial** and **commands list**!\n${modules}`,
      fieldNames,
      fieldValues,
      inlines
    });

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("help")
        .setPlaceholder("Choose a module!")
        .addOptions(options)
    );
    const row2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("last_page")
        .setEmoji(emotes.left)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("next_page")
        .setEmoji(emotes.right)
        .setStyle("PRIMARY")
    );
    let m = await message.channel.send({
      embeds: [embed],
      components: [row, row2],
    });

    const collector = message.channel.createMessageComponentCollector({
      idle: 60000,
    });
    let page = 0;
    let option;

    if (args[0]) {
      option = args[0];
      const embed1 = await getPage(bot, option, 0);
      await m.update({ embeds: [embed1] });
    }
    collector.on("collect", async (i) => {
      if (i.customId) {
        if (i.customId == "last_page") {
          if (page == 0) page = getNumberOfPages(bot, option);

          page--;
          const embed1 = await getPage(bot, option, page);
          await i.update({ embeds: [embed1] });
        }

        if (i.customId == "next_page") {
          if (page == getNumberOfPages(bot, option) - 1) page = -1;
          page++;
          const embed1 = await getPage(bot, option, page);
          await i.update({ embeds: [embed1] });
        }

        if (i.customId == "help") {
          option = i.values[0];
          page = 0;
          const embed1 = await getPage(bot, option, 0);
          await i.update({ embeds: [embed1] });
        }
      }
    });
  },
};
