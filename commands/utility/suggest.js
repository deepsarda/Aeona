const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "suggest",
  description: "Suggest a somthing to the server",
  usage: "+suggest <suggestion>",
  aliases: ["suggestion"],
  category: "utility",
  requiredArgs: 1,
  execute: async (message, args, bot, prefix) => {},
};
