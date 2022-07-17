const Discord = require("discord.js");
const customCommand = require("../database/schemas/customCommand");

module.exports = async function (message, command) {
  const customCommandSettings = await customCommand.findOne({
    guildId: message.guild.id,
    name: command.toLowerCase(),
  });

  const customCommandEmbed = await customCommand.findOne({
    guildId: message.guild.id,
    name: command.toLowerCase(),
  });

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    customCommandSettings.description
  ) {
    if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

    let embed = new MessageEmbed()
      .setTitle(customCommandEmbed.title)
      .setDescription(customCommandEmbed.description)
      .setFooter(``);

    if (customCommandEmbed.image !== "none")
      embed.setImage(customCommandEmbed.image);
    if (customCommandEmbed.thumbnail !== "none")
      embed.setThumbnail(customCommandEmbed.thumbnail);

    if (customCommandEmbed.footer !== "none")
      embed.setFooter(customCommandEmbed.footer);
    if (customCommandEmbed.timestamp !== "no") embed.setTimestamp();
    if (customCommandEmbed.color == "default") {
      embed.setColor(message.guild.me.displayHexColor);
    } else embed.setColor(`${customCommandEmbed.color}`);

    return message.channel.send({ embeds: [embed] });
  }

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    !customCommandSettings.description &&
    customCommandSettings.json == "false"
  ) {
    return message.channel.send(
      customCommandSettings.content

        .replace(/{user}/g, `${message.author}`)

        .replace(/{user_tag}/g, `${message.author.tag}`)
        .replace(/{user_name}/g, `${message.author.username}`)
        .replace(/{user_ID}/g, `${message.author.id}`)
        .replace(/{guild_name}/g, `${message.guild.name}`)
        .replace(/{guild_ID}/g, `${message.guild.id}`)
        .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        .replace(/{size}/g, `${message.guild.memberCount}`)
        .replace(/{guild}/g, `${message.guild.name}`)
        .replace(
          /{member_createdAtAgo}/g,
          `${moment(message.author.createdTimestamp).fromNow()}`
        )
        .replace(
          /{member_createdAt}/g,
          `${moment(message.author.createdAt).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}`
        )
    );
  }

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    !customCommandSettings.description &&
    customCommandSettings.json == "true"
  ) {
    const command = JSON.parse(customCommandSettings.content);
    message.channel.send(command).catch((e) => {
      message.channel.send(
        `There was a problem sending your embed, which is probably a JSON error.\nRead more here --> https://Aeona.xyz/embeds\n\n__Error:__\n\`${e}\``
      );
    });

    return true;
  }
};
