const fs = require("fs");

const Discord = require("discord.js");

module.exports = {
    name: "messageCreate",
    execute: async message => {
        let args = message.content.split(" ");
        let command = args.shift().toLowerCase();

        args = args.slice(1);

        const categories = ["anime", "chatbot", "config", "economy", "fun", "game", "images", "mod", "utility"];
        
        for (const category of categories) {
            const files = fs.readdirSync(`../commands/${category}`).filter(file => file.endsWith('.js'));
            for (const file of files) {
                const fileCommand = require(`../commands/${category}/${file}`);
                if (fileCommand.name.toLowerCase() === command.toLowerCase())
                    return fileCommand.execute(message, args, message.client, Discord)
            }
        };
    }
};