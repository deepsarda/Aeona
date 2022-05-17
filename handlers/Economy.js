const EconomySchema = require("../database/schemas/Economy.js");

module.exports = class Economy {
  constructor(client) {
    this.client = client;
    client.economy = this;
  }

  async createUser(userId) {
    const user = new EconomySchema({
      userId: userId,
      money: {
        wallet: 10000,
        bank: 0,
        maxBank: 100000,
      },
      items: [],
      kills: 0,
      wins: 0,
      gameplayed: 0,
      deaths: 0,
      donations: 0,
      heals: 0,
      moves: 0,
      rank: "Noob",
    });
    await user.save();

    return user;
  }

  async getUser(userId) {
    const user = await EconomySchema.findOne({ userId: userId });
    if (!user) {
      return await this.createUser(userId);
    }
    return user;
  }
};
