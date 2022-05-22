const EconomySchema = require("../database/schemas/Economy.js");
const items = require("../data/items");
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
  async getAllConfigs() {
    return await EconomySchema.find({});
  }
  async getUser(userId) {
    const user = await EconomySchema.findOne({ userId: userId });
    if (!user) {
      return await this.createUser(userId);
    }
    return user;
  }
  async getConfig(member) {
    return await this.getUser(member.id);
  }
  async getOres(id) {
    let profile = this.getUser(id);
    if (!profile) {
      return;
    }
    profile.items = profile.items.filter((item) => {
      return this.getItem(item.name).description.includes("mining");
    });
    return profile.items;
  }
  async getAnimals(id) {
    let profile = await this.getUser(id);
    if (!profile) {
      return;
    }
    profile.items = profile.items.filter((item) => {
      return this.getItem(item.name).description.includes("hunted");
    });
    return profile.items;
  }

  async getFish(id) {
    let profile = this.getUser(id);
    if (!profile) {
      return;
    }
    profile.items = profile.items.filter((item) => {
      return this.getItem(item.name).description.includes("fish");
    });
    return profile.items;
  }

  getItem(name) {
    let e = items.find((e) => {
      //Check if name mathes or its an alias

      if (
        e.name.toLowerCase() == name.toLowerCase() ||
        e.aliases.includes(name.toLowerCase())
      ) {
        return e;
      }
    });

    return e;
  }

  getItems() {
    return items;
  }
  getItemFromArray(array, itemName) {
    //Loop through the array
    for (let i = 0; i < array.length; i++) {
      //Check if the item is in the array
      if (array[i].aliases) {
        if (
          array[i].name.toLowerCase() == itemName.toLowerCase() ||
          array[i].aliases.includes(itemName.toLowerCase())
        ) {
          return { item: array[i], index: i };
        }
      } else {
        if (array[i].name.toLowerCase() == itemName.toLowerCase()) {
          return { item: array[i], index: i };
        }
      }
    }
  }

  async giveUserItem(id, i, amount) {
    let config = await this.getUser(id);

    let item = this.getItemFromArray(config.items, i);
    let a = this.getItem(i);
    if (!item) {
      config.items.push({
        name: a.name,
        amount: amount,
        level: 0,
      });
    } else {
      config.items[item.index].amount += amount;
    }
    await config.save();
  }

  async giveUserCredits(id, amount) {
    let config = await this.getUser(id);
    config.money.wallet += amount;
    config.markModified("pets");
    await config.save();
  }

  async takeUserCredits(id, amount) {
    let config = await this.getUser(id);
    config.money.wallet -= amount;
    config.markModified("pets");
    await config.save();
  }

  async takeUserItem(id, item, amount) {
    let config = await this.getUser(id);
    let item = await this.getItemFromArray(config.items, item);
    if (!item) {
      return;
    } else {
      config.items[item.index].amount -= amount;
    }

    if (config.items[item.index].amount <= 0) {
      config.items.splice(item.index, 1);
    }

    await config.save();
  }
};
