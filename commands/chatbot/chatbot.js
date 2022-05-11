const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "chatbot",
      aliases: ["cb"],
      description: "Change which chatbot you use by default",
      category: "Chatbot",
      cooldown: 3,
      usage: "<chatbot>",
      userPermission: ["MANAGE_GUILD"],
    });
  }
  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    if (guildDB.isPremium === "false") {
      return message.channel.send(
        "~~Oops! Looks like this command is only available for premium servers~~\n\nPsst.. We'll cut you a deal.\nAeona Premium is **free** until we hit 1000 servers!\nGet it here for free: https://aeona.xyz/redeem"
      );
    }

  //   let row=new Discord.MessageActionRow();
  //   row.addComponents([
  //       new Discord.MessageButton({label:"Aeona (recommended)",customId:"deepparag/Aeona",style:"SECONDARY"}),
  //       new Discord.MessageButton({label:"Harry Potter",customId:"Invincible/Chat_bot-Harrypotter-medium",style:"SECONDARY"}),
  //       new Discord.MessageButton({label:"Palpatine",customId:"Filosofas/DialoGPT-medium-PALPATINE",style:"SECONDARY"}),
  //       new Discord.MessageButton({label:"Elon Musk",customId:"luca-martial/DialoGPT-Elon",style:"SECONDARY"}),
  //       new Discord.MessageButton({label:"Loki",customId:"bhaden94/LokiDiscordBot-medium",style:"SECONDARY"}),

  //   ])

  //   let row2=new Discord.MessageActionRow();

  //   row2.addComponents([
  //     new Discord.MessageButton({label:"Spider Man",customId:"ignkai/DialoGPT-medium-spider-man-updated",style:"SECONDARY"}),
  //     new Discord.MessageButton({label:"Shrek",customId:"CianB/DialoGPT-small-Shrek2",style:"SECONDARY"}),
  //     new Discord.MessageButton({label:"Gandalf",customId:"Zuha/DialoGPT-small-gandalf",style:"SECONDARY"}),
  //     new Discord.MessageButton({label:"Iron Man",customId:"Dawit/DialogGPT-small-ironman",style:"SECONDARY"}),
  //     new Discord.MessageButton({label:"Pinocchio",customId:"jackyv/DialoGPT-small-pinocchio",style:"SECONDARY"}),
  // ]);

    let row3 = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("Select a chatbot!")
            .addOptions([
              {
                label: "Aeona (recommended)",
                description: "Aeona is a chatbot developed by our dev-team which is very powerful.",
                value: "deepparag/Aeona"
              },
              {
                label: "Harry Potter",
                description: "Turn Aeona into your favorite wizard from pop-culture!",
                value: "Invincible/Chat_bot-Harrypotter-medium"
              },
              {
                label: "Palpatine",
                description: "Make Aeona turn into the gruesome Galactic Emperor from Star Wars!",
                value: "Filosofas/DialoGPT-medium-PALPATINE"
              },
              {
                label: "Elon Musk",
                description: "Watch Aeona turn into the famous eccentric billionare we all know and love",
                value: "luca-martial/DialoGPT-Elon"
              },
              {
                label: "Loki",
                description: "The God of Mischief himself, now in the form of Aeona!",
                value: "bhaden94/LokiDiscordBot-medium"
              },
              {
                label: "Spider Man",
                description: "Aeona turns into your friendly neighbourhood Spider Man!",
                value: "ignkai/DialoGPT-medium-spider-man-updated"
              },
              {
                label: "Shrek",
                description: "Turn Aeona into the ever-memed ogre, Shrek!",
                value: "CianB/DialoGPT-small-Shrek2"
              },
              {
                label: "Gandalf",
                description: "Turn Aeona into the legendary wizard Gandalf",
                value: "Zuha/DialoGPT-small-gandalf"
              },
              {
                label: "Iron Man",
                description: "Watch Aeona turn into the *other* famous eccentric billionare from the MCU",
                value: "Dawit/DialogGPT-small-ironman"
              },
              {
                label: "Pinocchio",
                description: "Aeona turns into Pinocchio!",
                value: "jackyv/DialoGPT-small-pinocchio"
              }
            ])
        )


    let embed = new Discord.MessageEmbed()
                    .setTitle("Choose a chatbot")
                    .setDescription("Choose a chatbot to use by default. \n We recommend Aeona as it will have the fastest response time.")
                    .setColor("#0099ff")
                    .setFooter({ text: "Aeona Bot" });

    let m = await message.channel.send({ embeds: [embed], components: [row3] });
    const filter = i => i.user.id === message.author.id && i.message.id === m.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
    
    collector.on("collect", async (i) => {
        guildDB.chatbot.chatbot = i.values[0];
        await guildDB.save();
        console.log(guildDB.chatbot.chatbot);
        await i.update({ content: `The chatbot was successfully set to ${i.label}!` });
    })
}
};
