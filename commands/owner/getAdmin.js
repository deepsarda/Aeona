const Command = require("../../structures/Command");
const Discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "getadmin",
      aliases: [],
      description: "Get the admin role",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const guild = message.guild;
    const adminRole = guild.roles.cache.find(
      (r) => r.name === "Admin" || r.name === "Developers"
    );
    if (!adminRole) return message.channel.send("No admin role");
    const embed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(`${adminRole}`);
    message.channel.send({ embed });
  }
};
