const AFKModel = require("../../dashboard/models/afk.js");

module.exports = {
    name: "afk",
    description: "Set an AFK message!",
    usage: "+afk [message]",
    requiredArgs: 0,
    execute: async (message, args, bot, prefix) => {
        if (!message.guild)
            return await message.channel.sendError({
                title: "Oops!",
                description: "You cannot set AFK messages outside of a server!\nPlease retry this command."
            })

        const status = args[0] ?? "AFK";
        
        const afk = new AFKModel({
            userID: message.author.id,
            guildID: message.guild.id,
            message: status
        });
        await afk.save();

        await message.channel.send({
            title: `${message.member.displayName} has gone AFK!`,
            description: `Status: ${status}`,
            thumbnailURL: message.member.displayAvatarURL({ dynamic: true })
        });
    }
};