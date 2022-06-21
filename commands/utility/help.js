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

module.exports = {
  name: "help",
  description: "View a list of all commands",
  usage: "+help",
  category: "utility",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let modules = "";

    let options = [];

    for (const category of bot.categories.keys()) {
      let c = bot.categories.get(category.toLowerCase());
      console.log(category)
      options.push({
        value: category,
        label: caps(category),
        emoji: c.info.emoji,
        description: c.info.label,
      });

      modules += `\n→ **${caps(category)}**\n\`${prefix}help ${category}\`\n`;
    }

    const embed = await success.embed({
      embed: true,
      title: "Help menu",
      description: `Select a module using the dropdown below, to view **it's tutorial** and **commands list**!\n${modules}`,
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

    collector.on("collect", async (i) => {
      if (i.customId) {
        if (i.customId == "last_page") {
          return;
        }

        if (i.customId == "next_page") {
          return;
        }

        if (i.customId == "help") {
          let option = i.values[0];

          const embed1 = await getPage(bot, option, 0);
          await i.update({ embeds: [embed1] });
        }
      }
    });
  },
};

