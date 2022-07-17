const Levels = require("discord-xp");
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const parseUser = require("../../utils/parseUser.js");
const Discord=require("discord.js");

module.exports = {
    name: "leaderboard",
    description: "Check the leaderboard",
    usage: "+leaderboard",
    category: "levels",
    requiredArgs: 0,
    aliases: ["lb"],
    execute: async (message, args, bot, prefix) => {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

        if (rawLeaderboard.length < 1) return message.reply("Nobody's in leaderboard yet.");

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
        let files=[];

        for (let i = 0; i < leaderboard.length; i++) {
            let target = await message.guild.members.fetch(leaderboard[i].id).catch(() => {});
            let user = leaderboard[i];

            let data = await canva.profile({
                name: target?target.user.username:"Unknown",
                discriminator: target?target.user.discriminator:"#0000",
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
            files.push(attachment);

        }

        message.channel.send({
            content: `**Leaderboard for ${message.guild.name}**`,
            embeds: [],
            files: files,
        });
    }
}