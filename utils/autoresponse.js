const autoResponse = require("../database/schemas/autoResponse");
const moment=require("moment")
module.exports = async function (message, autoResponseCooldown) {
  const autoResponseSettings = await autoResponse.find({
    guildId: message.guild.id,
  });

  if (autoResponseSettings.length > 0) {
    for (let i = 0; i < autoResponseSettings.length; i++) {
      if (
        message.content
          .toLowerCase()
          .includes(autoResponseSettings[i].name.toLowerCase())
      ) {
        if (!autoResponseCooldown.has(message.author.id))
          message.channel.send(
            autoResponseSettings[i].content
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
        autoResponseCooldown.add(message.author.id);
        setTimeout(() => {
          autoResponseCooldown.delete(message.author.id);
        }, 2000);
        return { success: true, cooldown: autoResponseCooldown };
      }
    }
  }
  return { success: false, cooldown: autoResponseCooldown };
};
