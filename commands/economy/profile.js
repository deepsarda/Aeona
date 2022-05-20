const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "profile",
      aliases: ["stats","stat"],
      description: "See yours or someones stat",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    const mentionUser = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false|| message.guild.members.cache.get(args[0])|| args.length > 0 && message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase()))||message.member;
    
    let user=message.client.economy.getUser(mentionUser.id)

    let embed=new Discord.MessageEmbed().setTitle(`${user}'s Profile`).setThumbnail(mentionUser.displayAvatarURL({dynamic:true})).addField("Wallet",user.money.wallet.toLocaleString()+'₪')
    .addField(`Bank`,user.money.bank.toLocaleString()+'/'+user.money.maxBank.toLocaleString()+`₪`)
    .addField(`Tank Tactics`,'_ _')
    .addField(`Games Played`,user.gameplayed,true)
    .addField('Wins',user.wins,true)
    .addField('Kills',user.kills,true)
    .addField('Deaths',user.deaths,true)
    .addField('Moves',user.moves,true)
    .addField('Donations',user.dontations,true)
    .addField('Heals',user.heals,true)


    message.reply({embeds:[embed]});
}   
};
