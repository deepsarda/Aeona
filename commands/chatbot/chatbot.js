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
        "This command is only available for premium servers! \n Get it here for free: https://aeona.xyz/redeem"
      );
    }

    let row=new Discord.MessageActionRow();
    row.addComponents([
        new Discord.MessageButton({label:"Aeona (recommended)",customId:"deepparag/Aeona",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Harry Potter",customId:"Invincible/Chat_bot-Harrypotter-medium",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Palpatine",customId:"Filosofas/DialoGPT-medium-PALPATINE",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Elon Musk",customId:"luca-martial/DialoGPT-Elon",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Loki",customId:"bhaden94/LokiDiscordBot-medium",style:"SECONDARY"}),

    ])

    let row2=new Discord.MessageActionRow();
    row2.addComponents([
        new Discord.MessageButton({label:"Spider Man",customId:"ignkai/DialoGPT-medium-spider-man-updated",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Shrek",customId:"CianB/DialoGPT-small-Shrek2",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Gandalf",customId:"Zuha/DialoGPT-small-gandalf",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Iron Man",customId:"Dawit/DialogGPT-small-ironman",style:"SECONDARY"}),
        new Discord.MessageButton({label:"Pinocchio",customId:"jackyv/DialoGPT-small-pinocchio",style:"SECONDARY"}),
    ]);
    let embed=new Discord.MessageEmbed().setTitle("Choose a chatbot").setDescription("Choose a chatbot to use by default. \n We recommend Aeona as it will have the fastest response time.").setColor("#0099ff").setFooter("Aeona Bot");
    let m=await message.channel.send({embeds:[embed],components:[row,row2]});
    const filter = i => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
    
    collector.on("collect", async (i) => {
        guildDB.chatbot.chatbot=i.customId;
        await guildDB.save();
        console.log(guildDB.chatbot.chatbot);
        await i.update({ content: `✅ \n > Successfully set the chatbot to ${i.label}.` });
    })
}
};
