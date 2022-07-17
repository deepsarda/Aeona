const guild = require("../../database/schemas/Guild");

module.exports = {
    name: "removereward",
    description: "Remove a reward from a certain level",
    usage: "+removereward <level>",
    category: "config",
    requiredArgs: 1,
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {

        let guild = await guild.findOne({ guildId: message.guild.id });

        let level = parseInt(args[0]);

        if (!level || Number.isNaN(level)) return message.replyError({
            title: `leveling`,
            description: `Invalid usage! The level must be a number.`,
        });

        for (let i = 0; i < guild.leveling.roles.length; i++) {
            if (guild.leveling.roles[i].level === level) {
                guild.leveling.roles.splice(i, 1);
                guild.markModified("leveling.roles");
                await guild.save();

                return message.reply({
                    title: `leveling`,
                    description: `The reward for level ${level} was successfully removed!`,
                });

            }
        }

        return message.replyError({
            title: `leveling`,
            description: `There is no reward for level ${level}!`,
        });

    }
}
