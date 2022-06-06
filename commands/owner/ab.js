const Command = require("../../structures/Command");
const { exec } = require("child_process");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "exadadaec",
      aliases: ["daddasdad"],
      description: "This is for the developers.",
      category: "Owner",
      usage: ["<thing-to-exec>"],
      ownerOnly: true,
    });
  }

  async run(message, args, bot, prefix = "+") {
    let users = await bot.economy.getAllConfigs();
    for (let user of users) {
      if (user.money.wallet > 1000000 || !Number.isFinite(user.money.wallet)) {
        user.money.wallet = 1000000;
      }

      try {
        let u = await bot.users.fetch(user.userId);
        await u.send(
          `Hello ${u.username}, your wallet has been reset to ${user.money.wallet} because you have more than 1000000 or you have a non-finite number. Also your items have been reset.  But you have been given **1 million** extra credits compared to otheer players!  Also there is a new upgrade cost system use \`+help upgrade\``
        );

        console.log(`${u.username} has been reset.`);
      } catch (e) {}

      user.items = [];
      await user.save();
    }
  }
};
