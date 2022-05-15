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
    let client = message.client;
    const language = require(`../../data/language/${guildDB.language}.json`);
    await message.guild.members.fetch();
    const embed = new MessageEmbed()
      .setFooter({ text: `Shard #${message.guild.shardID}` })
      .setAuthor({ name: message.guild.name, iconUrl: message.guild.iconURL })
      .addField(
        `<:owner:956753542612406343> Owner`,
        `> <@${message.guild.ownerId}> (ID: \`${message.guild.ownerId}\`)`,
        true
      )
      .addField(
        `<:channel:956753542541115432> Server ID`,
        `> \`${message.guild.id}\``,
        true
      )
      .addField(
        `<:discord_2:956753542650155100> Description`,
        `> ${message.guild.description || "No server description!"}`
      )
      .addField(
        `<:members:956753542662717510> Members`,
        `\`${message.guild.memberCount}/${
          message.guild.maximumMembers
        }\` members (\`${
          message.guild.members.cache.filter((member) => member.user.bot).size
        }\` bots)`
      )
      .addField(
        `<a:badges_roll:956753542494973953> Emojis`,
        `> Total emojis: \`${message.guild.emojis.cache.size}\``,
        true
      )
      .addField(
        `<a:booster:956753544923455508> Boosts`,
        `> \`${message.guild.premiumSubscriptionCount}\` (${capitalize(
          message.guild.premiumTier.toLowerCase().replace("_", " ")
        )})`,
        true
      )
      .addField(
        `:lock: Verification`,
        `> \`${capitalize(
          message.guild.verificationLevel.toLowerCase().replace("_", " ")
        )}\``,
        true
      )
      .addField(
        `:stopwatch: Creation Date`,
        `> <t:${moment(
          message.channel.guild.createdTimestamp
        ).unix()}> (<t:${moment(
          message.channel.guild.createdTimestamp
        ).unix()}:R>)`,
        true
      )
      .setThumbnail(message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] });
  }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
