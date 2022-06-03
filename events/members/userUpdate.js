const Username = require("../../database/schemas/usernames");
const Maintenance = require("../../database/schemas/maintenance");
module.exports = {
  name: "userUpdate",
  async execute(client, oldUser, newUser) {
    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;

    if (
      oldUser.username != newUser.username ||
      oldUser.discriminator != newUser.discriminator
    ) {
      let user = await Username.findOne({
        discordId: newUser.id,
      });

      if (!user) {
        const newUser1 = new Username({
          discordId: newUser.id,
        });
        newUser1.usernames.push(newUser.tag);
        newUser1.save();

        user = await Username.findOne({
          discordId: newUser.id,
        });
      } else {
        if (user.usernames.length > 4) {
          user.usernames.splice(-5, 1);
          user.usernames.push(newUser.tag);
        } else {
          user.usernames.push(newUser.tag);
        }

        user.save().catch(() => {});
      }
    }
  },
};
