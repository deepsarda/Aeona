const Discord = require("discord.js");
const Command = require("../../structures/Command");
module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
          name: "comingsoon",
          aliases: [],
          usage: "",
          description: "Releasing very soon!",
          category: "game",
          cooldown: 3,
        });
      }
    
        async run(message, args) {
            message.channel.send("https://discord.com/channels/942062344840822824/970641138912489492/975798459821080656")     
        }
    };
    