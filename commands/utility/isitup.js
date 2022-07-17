const fetch = require("node-fetch");
const PROTOCOL_REGEX = /^[a-zA-Z]+:\/\//;
const PATH_REGEX = /(\/(.+)?)/g;

module.exports = {
  name: "isitup",
  description: "Check if a website is up",
  usage: "+isitup <url>",
  category: "utility",
  requiredArgs: 1,
  execute: async (message, args, bot, prefix) => {
    let url = args[0];
    url = url.toString().replace(PROTOCOL_REGEX, "").replace(PATH_REGEX, "");
    const body = await fetch(`https://isitup.org/${url}.json`).then((res) =>
      res.json()
    );
    if (body.response_code) {
      body.response_time *= 1000;
      return message.reply({
        title: "Is it up?",
        description: `Is ${url} up? \n**${body.response_ip}**\n**${body.response_time}ms**\n**${body.response_code}**`,
      });
    } else {
      return message.replyError({
        title: "Is it up?",
        description: `${url} is down!`,
      });
    }
  },
};
