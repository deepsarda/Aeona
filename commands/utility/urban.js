const axios = require("axios").default;

const { emotes } = require("../../utils/resources.js");

module.exports = {
  name: "urban",
  description: "Look up a definition on urban dictionary",
  usage: "+urban <term>",
  category: "utility",
  requiredArgs: 1,
  execute: async (message, args, bot, prefix) => {
    const term = args.join(" ");

    let options = {
      url: `https://api.urbandictionary.com/v0/define?term=${term}`,
      json: true,
    };

    let response = await axios.get(options.url);
    response = response.data.list[0];

    if (!response)
      return await message.replyError({
        title: "Oops!",
        description: "We were unable to fetch a definition for your term!",
      });

    await message.reply({
      title: `Definition for: ${term}`,
      description: response.definition,
      thumbnailURL: message.member.displayAvatarURL({ dynamic: true }),
      fieldNames: ["Example:"],
      fieldValues: [`${emotes.pencil} ${response.example}`],
      inlines: [false],
    });
  },
};
