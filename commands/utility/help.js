const { success, emotes } = require("../../utils/resources.js");
const Discord = require("discord.js");
//done let me change the client so that we can add a _info.js which will have the label and value duck hold up autocorrect go brrr 

const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const getPage = async (bot, category, page) => {
  const commands = bot.categories.get(category).commands.slice(
    page * 7, ((page + 1) * 7) - 1
  );
  const description = "";
  //you went offline on dc lol 
  
  for (const command of commands) {
    description += `${emotes.dot} \`${command.usage}\` → ${command.description}\n`
  }
  
  const embed = await success.embed({
    embed: true,
    title: `${capitalize(category)} Commands`,
    description: description,
    footerText: `Page ${page + 1} of ${Math.floor(bot.commands.length / 7)}`
  })
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
      
      let c = bot.categories.get(category)
      
      options.push({
        label: c.info.label,
        value: category
      });
      
      modules += `\n\`${prefix}help ${category}\` → **${capitalize(category)}**\n`

    }

    const embed = await success.embed({
      embed: true,
      title: "Help menu",
      description:
        `Select a module using the dropdown below, to view **it's tutorial** and **commands list**!\n${modules}`,
    });

    const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('help')
					.setPlaceholder('Choose a module!')
					.addOptions(options),
			);

    let m = await message.channel.send({
      embeds: [embed],
      components: [row]
    });


    const filter = i => i.user.id === message.author.id && i.message.id === m.id;
    
    const collector = message.channel.createMessageComponentCollector({
      filter,
      idle: 60000,
    });

    collector.on("collect", async i => {
      let option = i.values[0];
      const embed = await getPage(bot, option, 0);
      await i.reply({ embeds: [embed] });
    });
    
  },
};
