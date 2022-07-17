const afk = require("../database/schemas/afk");

module.exports = async function (settings, message, client) {
  if (message.mentions.members.first()) {
    const afklist = await afk.findOne({
      userID: message.mentions.members.first().id,
      serverID: message.guild.id,
    });
    if (afklist) {
      await message.guild.members.fetch(afklist.userID).then((member) => {
        let user_tag = member.user.tag;
        return message.channel
          .send(
            `**${
              afklist.oldNickname || user_tag || member.user.username
            }** is currently AFK.\n
               **${afklist.reason} **- ${moment(afklist.time).fromNow()}**`
          )
          .catch(() => {});
      });
    }
  }

  const afklis = await afk.findOne({
    userID: message.author.id,
    serverID: message.guild.id,
  });

  if (afklis) {
    let nickname = `${afklis.oldNickname}`;
    message.member.setNickname(nickname).catch(() => {});
    await afk.deleteOne({ userID: message.author.id });
    return message.channel
      .send({
        description: `Welcome back ${
          message.author
        }! You are no longer AFK. \n You had gone AFK for ${moment(
          afklis.time
        ).fromNow()} for the reason of ${afklis.reason}`,
      })
      .then((m) => {
        setTimeout(() => {
          m.delete().catch(() => {});
        }, 10000);
      });
  }
};
