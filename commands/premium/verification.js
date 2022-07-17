const Guild = require("../../database/schemas/Guild");

module.exports = {
    name: "verification",
    description: "Verify users who join your server",
    usage: "+verification enable <channel> <role> or +verification disable",
    category: "config",
    requiredArgs: 1,
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {
        const guild = await Guild.findOne({ guildId: message.guild.id });

        if (guild.isPremium === "false")
            return message.replyError({
                title: "verification",
                description: `This command is premium only. Get [premium.](${process.env.domain}/premium)`,
            });

        if (args[0] === "enable") {
            let channel =
                message.mentions.channels.first() ||
                message.guild.channels.cache.get(args[1]);

            if (!channel)
                return message.replyError({
                    title: `verification`,
                    description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}verification <channel> <role>\``,
                });

            guild.verification.verificationChannel = channel.id;

            let role = message.mentions.roles.first() ||await message.guild.roles.fetch(args[2]).catch(() => { });
            if (!role) return message.replyError({
                title: `verification`,
                description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}verification <channel> <role>\``,
            });
            guild.verification.verificationRole = role.id;
            guild.verification.enabled = true;
            await guild.save();
            return message.reply({
                title: `verification`,
                description: `verification was successfully set!`,
            });
        } else {
            guild.verification.enabled = false;
            await guild.save();
            return message.reply({
                title: `verification`,
                description: `verification was successfully disabled!`,
            });
        }
    },
};
