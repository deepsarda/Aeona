module.exports = {
    name: "f",
    description: "Pay your respects!",
    usage: "+f",
    execute: async (message, args, bot, prefix) => {
        const m = await message.channel.send({
            authorName: `${message.member.displayName} has paid their respects.`,
            authorIconURL: message.member.displayAvatarURL({ dynamic: true }),
            footerText: "Press F to pay your respects."
        });
        m.react("🇫");
    }
};