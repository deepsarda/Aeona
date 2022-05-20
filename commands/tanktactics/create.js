const Discord = require("discord.js");
const Command = require("../../structures/Command");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "create",
      aliases: [],
      usage: "",
      description: "Create a game of Tank Tactics",
      category: "tanktactics",
      cooldown: 3,
    });
  }

  async run(message, args) {
    let game = await message.client.tankTacticsHandler.getGame(
      message.channel.id
    );

    if (game) {
      return message.channel.send("There is already a game in this channel!");
    }

    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Tank Tactics")
      .setDescription(
        "Options for creating a new game! \n **Private Game**: Can be made in a channel and play with your server mated but longer match timings! \n **Public Game**: Can be made in a thread and play with anyone in the world! Fastest match timings!"
      );

    let row = new Discord.MessageActionRow();
    row.addComponents([
      new Discord.MessageButton()
        .setLabel("Private Game")
        .setCustomId("private")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setLabel("Public Game")
        .setCustomId("public")
        .setStyle("PRIMARY"),
    ]);

    let m = await message.channel.send({ embeds: [embed], components: [row] });
    const filter = (i) => i.user.id === message.author.id;
    const collector = m.channel.createMessageComponentCollector({
      filter,
      time: 60000 * 10,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "private") {
       let g= await message.client.tankTacticsHandler.createGame(message.channel.id,false);

        message.client.tankTacticsHandler.join(g,message.member,message)
      }
      if (i.customId === "public") {
        //Check if the channel is a thread
        if (message.channel.isThread()) {
          let g=await message.client.tankTacticsHandler.getPublicGame(message.channel.id);
          message.client.tankTacticsHandler.join(g,message.member,message)

          message.channel.send(`${message.member} **NOTE ALL MESSAGES SENT HERE WILL BE SENT TO ALL PLAYERS IN THE GAME!**`);
        } else {
            return message.channel.send("You can only create a public game in a thread!  **This for privacy reasons!**");
            
        }
      }
    });

    collector.on("end", async (collected) => {
      await m.delete();
    });
  }
};
