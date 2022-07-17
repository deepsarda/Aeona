module.exports = (message, args) => {
  const user =
    message.mentions.members.first() &&
    message.mentions.members.filter(
      (m) => args[0] && args[0].includes(m.user.id)
    ).size >= 1
      ? message.mentions.members
          .filter((m) => args[0] && args[0].includes(m.user.id))
          .first()
      : false ||
        message.guild.members.cache.get(args[0]) ||
        (args.length > 0 &&
          message.guild.members.cache.find((m) =>
            m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())
          )) ||
        message.member;

  return user;
};
