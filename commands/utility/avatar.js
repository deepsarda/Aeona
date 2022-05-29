module.exports = {
    name: "avatar",
    description: "View someone's avatar",
    usage: "+avatar [@member]",
    requiredArgs: 0,
    execute: async (message, args, bot, prefix) => {
        const member = message.mentions.members.first() ?? message.member;
        const avatar = member.displayAvatarURL({ dynamic: true });

        await message.channel.send({
            title: `${member.displayName}'s Avatar`,
            url: avatar,
            imageURL: avatar
        })
    }
}