const Guild = require("../../database/schemas/Guild");

module.exports = {
    name: "suggestion",
    description: "Enable suggestions for the server",
    usage: "+suggestion <enable #channel | disable> / suggestion approve/decline <message ID>",
    category: "config",
    requiredArgs: 1,
    aliases: [],
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {
        const guild = await Guild.findOne({ guildId: message.guild.id });

        let option = args[0];

        if (option === "enable") {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

            if (!channel) return message.channel.sendError({
                title: "Suggestion",
                description: `Please provide a valid channel. \n Valid arguments: \n enable #channel`,
            });

                
            guild.suggestion.suggestionChannelID  = channel.id;
            await guild.save();
            return message.channel.send({
                title: "Suggestion",
                description: `Suggestion has been enabled.`,
            });
        } else if (option === "disable") {
            guild.suggestion.suggestionChannelID = "";
            await guild.save();
            return message.channel.send({
                title: "Suggestion",
                description: `Suggestion has been disabled.`,
            });
        } else if (option === "approve" || option === "accept") {
            

    }
}

