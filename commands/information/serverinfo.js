const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "serverinfo",
      aliases: ["server", "si", "guildinfo", "info"],
      description: "Displays information about the current server.",
      category: "Information",
      guildOnly: true,
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    let client=bot.client;
    const language = require(`../../data/language/${guildDB.language}.json`);
    let owner=await message.guild.fetchOwner();
    await message.guild.members.fetch();
    const embed = new MessageEmbed()
      .setFooter({ text: `Shard #${message.guild.shardID}` })
      .setAuthor({name:message.guild.name,iconUrl: message.guild.iconURL})
      .addField(`${client.bot_emojis.owner_crown} Owner`, `> <@${message.guild.ownerId}> (ID: \`${message.guild.ownerId}\`)`, true)
    .addField(`${client.bot_emojis.channel} Server ID`, `> \`${message.guild.id}\``, true)
    .addField(`${client.bot_emojis.discord_logo} Description`, `> ${message.guild.description || "No server description!"}`)
    .addField(`${client.bot_emojis.member} Members`, `\`${message.guild.memberCount}/${message.guild.maximumMembers}\` members (\`${message.guild.members.cache.filter((member) => member.user.bot).size}\` bots)`)
    .addField(`${client.bot_emojis.discord_badges} Emojis`, `> Total emojis: \`${message.guild.emojis.cache.size}\``, true)
    .addField(`${client.bot_emojis.boosts_animated} Boosts`, `> \`${message.guild.premiumSubscriptionCount}\` (${capitalize(message.guild.premiumTier.toLowerCase().replace("_", " "))})`, true)
    .addField(`${client.bot_emojis.lock} Verification`, `> \`${capitalize(message.guild.verificationLevel.toLowerCase().replace("_", " "))}\``, true)
    .addField(`${client.bot_emojis.stopwatch} Creation Date`, `> <t:${moment(message.channel.guild.createdTimestamp).unix()}> (<t:${moment(message.channel.guild.createdTimestamp).unix()}:R>)`, true)
      .setThumbnail(message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds:[embed] });
  }
};
