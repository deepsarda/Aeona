const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");
const Paste = require("../../database/schemas/transcript.js");

module.exports = {
  name: "approve",
  description: "Approve a user's application",
  permissions: ["MANAGE_GUILD"],
  usage: "+approve <user> <app ID> <reason>",
  category: "Applications",
  requiredArgs: 3,
  aliases: ["approveapplication", "approveapplication", "approveform"],

  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false") {
      return message.replyError({
        title: "Applications",
        description: `This server is not premium. You can't use this command. \n Check out aeona premium [here](${process.env.domain}/premium).`,
      });
    }

    let app = await Applications.findOne({ guildID: message.guild.id });

    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.replyError({
        title: "Applications",
        description: `It seems that this server has no applications.`,
      });
    }

    let member = message.mentions.members.last();

    if (!member) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        member = message.member;
      }
    }

    if (!member)
      return message.replyError({
        title: "Applications",
        description: "You need to mention a user or provide a user ID.",
      });

    const paste = await Paste.findOne({
      type: "form",
      by: member.id,
      _id: args[1],
    });

    if (!paste)
      return message.replyError({
        title: "Applications",
        description: "I am unable to find that user's application",
      });

    let reason = args.slice(2).join(" ");

    if (!reason) reason = "No reason provided";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (paste.status === "approved")
      return message.replyError({
        title: "Applications",
        description: `That user's application has already been approved.`,
      });

    if (paste.status === "declined")
      return message.replyError({
        title: "Applications",
        description: `That user's application has already been denied.`,
      });

    let channel = await bot.channels.fetch(app.appLogs).catch();
    const add_role = message.guild.roles.cache.get(app.add_role);

    if (add_role) {
      await member.roles.add(add_role).catch(console.error);
    }

    paste.status = "approved";

    message.reply({
      title: "Applications",
      description: `${member} has been approved. \n **Approved by:** ${message.member} \n **Reason:** ${reason}`,
    });

    if (channel) {
      channel.send({
        title: "Applications",
        description: `${member} has been approved. \n **Approved by:** ${message.member} \n **Reason:** ${reason}`,
      });
    }

    await paste.save();

    if (app.dm === true)
      member
        .send({
          title: "Applications",
          description: `Your application has been approved. \n **Approved by:** ${message.member} \n **Reason:** ${reason}`,
        })
        .catch(console.error);
  },
};
