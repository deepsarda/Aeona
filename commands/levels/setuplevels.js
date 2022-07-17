const Guild = require("../../database/schemas/Guild");

module.exports = {
    name: "setuplevels",
    description: "Create a reminder to bump your server",
    usage: "+setuplevels enable or +setuplevels set <channel> <message(optional)> or +setuplevels disable",
    category: "config",
    requiredArgs: 1,
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {
        const guild = await Guild.findOne({ guildId: message.guild.id });
        if (args[0] === "enable") {
            guild.leveling.enabled = true;
            await guild.save();
            return message.reply({
                title: `leveling`,
                description: `leveling was successfully enabled! \n `,
            });
        } else
            if (args[0] === "set") {
                let channel =
                    message.mentions.channels.first() ||
                    message.guild.channels.cache.get(args[1]);

                if (!channel)
                    return message.replyError({
                        title: `leveling`,
                        description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}set <channel> <message(optional)>\` \n Variables: \`{user}\`, \`{level}\`, \`{xp}\`, \`{requiredXp}\`, \`{nextLevel}\`, \`{rank}\``,
                    });

                guild.leveling.levelUpChannel = channel.id;

                if (args[2]) {
                    guild.leveling.levelUpMessage = args.slice(2).join(" ");
                }
                guild.leveling.enabled = true;
                await guild.save();
                return message.reply({
                    title: `leveling`,
                    description: `Leveling System was successfully setup! \n use ${prefix}addreward to add give a reward to users when they reach a certain level.  \n Variables: \`{user}\`, \`{level}\`, \`{xp}\`, \`{requiredXp}\`, \`{nextLevel}\`, \`{rank}\``,
                });
            } else {
                guild.leveling.enabled = false;
                await guild.save();
                return message.reply({
                    title: `leveling`,
                    description: `leveling System was successfully disabled!`,
                });
            }
    },
};
