const Levels = require("discord-xp");
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const parseUser = require("../../utils/parseUser.js");
const Discord=require("discord.js");

module.exports = {
    name: "level",
    description: "Check your level",
    usage: "+level <user(optional)>",
    category: "levels",
    requiredArgs: 0,
    aliases: ["rank"],
    execute: async (message, args, bot, prefix) => {
        const target = parseUser(message, args); // Grab the target.

        const user = await Levels.fetch(target.id, message.guild.id); // Selects the target from the database.

        if (!user) return message.replyError({
            title: "level",
            description: "Levels are not enabled for this server."
        });


        let data = await canva.profile({
            name: target.user.username,
            discriminator: target.user.discriminator,
            avatar: target.displayAvatarURL({ format: "png" }),
            background: target.banner
                ? target.bannerURL({ format: "png", size: 4096 })
                : null,
            rank: 1,
            xp: user.cleanXp,
            level: user.level,
            maxxp: user.cleanNextLevelXp,
            blur: false,
        });

        const attachment = new Discord.MessageAttachment(data, "profile.png");

        message.channel.send({
            embeds: [],
            files: [attachment],
        });
    }
}