const Guild = require("../../database/schemas/Guild");

module.exports = {
    name: "addreward",
    description: "Add a reward to a certain level",
    usage: "+addreward <level> <role>",
    category: "config",
    requiredArgs: 2,
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {

        let guild = await Guild.findOne({ guildId: message.guild.id });

        let level = parseInt(args[0]);

        if (!level || Number.isNaN(level)) return message.replyError({
            title: `leveling`,
            description: `Invalid usage! The level must be a number.`,
        });

        let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[1]).catch(() => { });

        if (!role) return message.replyError({
            title: `leveling`,
            description: `Invalid usage! The role must be a valid role.`,
        });

        for (let i = 0; i < guild.leveling.roles.length; i++) {
            if (guild.leveling.roles[i].level === level) {
                guild.leveling.roles[i].role = role.id;
                guild.markModified("leveling.roles");
                await guild.save();

                return message.reply({
                    title: `leveling`,
                    description: `The reward for level ${level} was successfully updated to ${role}!`,
                });


            }
        }

        guild.leveling.roles.push({
            level: level,
            role: role.id
        });

        await guild.save();

        return message.reply({
            title: `leveling`,
            description: `Reward for level ${level} was successfully set to ${role}!`,
        });


    }
}