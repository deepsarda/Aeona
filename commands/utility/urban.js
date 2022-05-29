const request = require("request-promise-native");

const { emotes } = require("../../utils/handlers/resources.js"); 

module.exports = {
    name: "urban",
    description: "Look up a definition on urban dictionary",
    usage: "+urban <term>",
    requiredArgs: 1,
    execute: async (message, args, bot, prefix) => {
        const term = args.join(" ");

        let options = {
            url: `https://api.urbandictionary.com/v0/define?term=${term}`,
            json: true,
        };
    
        let response = await request(options);
        response = response.list[0];

        if (!response)
            return await message.channel.sendError({
                title: "Oops!",
                description: "We were unable to fetch a definition for your term!"
            })

        await message.channel.send({
            title: `Definition for: ${term}`,
            description: `${response.definition}\n\n${emotes.pencil} ${response.example}`
        })
}
};