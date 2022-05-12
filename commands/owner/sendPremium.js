const Command = require("../../structures/Command");
const User = require("../../database/schemas/User");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "sendpremium",
      aliases: [],
      description: "Send all the users a notification",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const client = message.client;

    //Get all the users
    const users = await User.find({});
    //Send the notification to all the users
    users.forEach(async (u) => {
      let user = client.users.cache.get(u.discordId);
      try {
        await user.send(
          `Hello ${user.username}! \n This is a notification for the fact that we will be giving **all the servers** I am in **Aeona Premium for free** for **a month at 24hrs** from now. \n Invite me at https://aeona.xyz/invite \n Thank you for being with us!`
        );
      } catch (e) {
        console.log(e);
      }
    });
  }
};
