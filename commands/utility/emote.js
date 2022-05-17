const resources = require("../../util/resources.js");

module.exports = {
    name: "emote",
    type: "utility",
    usage: "&{prefix} <link> <name>",
    description: "Creates an emote on the respective server!",
    permissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS"],
    aliases: ["add_emote", "add-emote", "emote_add", "emote-add"],
    execute: async (message, args, bot, Discord, prefix) => {

        const emote = message.

        if (!args[0] || !args[1]) {
            resources.error.embed({
                msg: message,
                title: "Invalid Usage!",
                description: `Command Usage: \`${prefix}${message.content.split(" ")[0]} <link> <name>\`\n\nPlease retry this command.`
            })
        }

        message.guild.emojis.create(args[0], args[1])
            .then(e => resources.error.embed({msg: message, title: `Created emote ${args[1]}`, imageURL: args[0]}))

    }
}