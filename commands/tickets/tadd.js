const ticketSchema = require("../../database/schemas/tickets.js");

module.exports = {
    name: "tadd",
    description: "Add a user to this ticket",
    usage: "+tadd <@user>",
    category: "tickets",
    requiredArgs: 1,
    premissions: ["MANAGE_ROLES"],
    execute: async (message, args, bot, prefix) => {
        let userToMention =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!userToMention)
            return message.replyError({
                title: "Ticket",
                description: "Please provide a valid user.",
            });

        let ticket = await ticketSchema.findOne({
            guildID: message.guild.id,
        });

        if (!ticket)
            return message.replyError({
                title: "Ticket",
                description: "Tickets are not enabled on this server.",
            });



        let Aeona = message.guild.me;
        let everyone = message.guild.roles.everyone;
        let author = message.author;


        message.channel.permissionOverwrites.edit(Aeona, {
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
        });

        message.channel.permissionOverwrites.edit(everyone, {
            VIEW_CHANNEL: false,
        });

        message.channel.permissionOverwrites.edit(author, {
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
        });

        message.channel.permissionOverwrites.edit(userToMention.id, {
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
        });

        if (ticketRole) {
            message.channel.permissionOverwrites.edit(ticketRole, {
                VIEW_CHANNEL: true,
                READ_MESSAGES: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                ATTACH_FILES: true,
            });
        }

        message.channel.send({
            title: "Ticket",
            description: `${userToMention} has been added to this ticket.`,
        });

    }

}