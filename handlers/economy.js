//Import the schema
const economy = require("../database/schemas/Economy");
const items = require("../utils/items.js");
module.exports.run = (bot) => {
  bot.economy = {
    getLogs: async function (member) {
      var profile = await bot.economy.getConfig(member);
      if (!profile) {
        return;
      }

      //Filter through the profile.items array and return the items that are a log
      profile.items = profile.items.filter((item) => {
        return bot.economy.getItem(item.name).description.includes("log");
      });
      console.log(profile.items);
      //return the items
      return profile.items;
    },
    getOres: async function (member) {
      var profile = await bot.economy.getConfig(member);
      if (!profile) {
        return;
      }
      profile.items = profile.items.filter((item) => {
        return bot.economy.getItem(item.name).description.includes("mining");
      });
      return profile.items;
    },
    getAnimals: async function (member) {
      var profile = await bot.economy.getConfig(member);
      if (!profile) {
        return;
      }
      profile.items = profile.items.filter((item) => {
        return bot.economy.getItem(item.name).description.includes("hunted");
      });
      return profile.items;
    },

    getFish: async function (member) {
      var profile = await bot.economy.getConfig(member);
      if (!profile) {
        return;
      }
      profile.items = profile.items.filter((item) => {
        return bot.economy.getItem(item.name).description.includes("fish");
      });
      return profile.items;
    },
    getConfig: async (id) => {
      var doc = await economy.findOne({ userId: id.id });
      if (!doc) {
        doc = await bot.economy.createConfig(id.id);
      }
      await doc.save();
      return doc;
    },
    createConfig: async (id) => {
      let newConfig = new economy({
        userId: id,
      });
      newConfig.markModified("pets");

      return newConfig;
    },
    updateConfig: async (id, key, value) => {
      economy.findOneAndUpdate(
        { userId: id },
        { [key]: value },
        async (err, doc) => {
          if (err) return console.log(err);
          if (!doc) {
            var config = bot.economy.createConfig(id);
            config[key] = value;
            await config.save();
            return config;
          }
          return doc;
        }
      );
    },
    getAllConfigs: async () => {
      return await economy.find({});
    },

    getItem: (name) => {
      var e = items.find((e) => {
        //Check if name mathes or its an alias

        if (
          e.name.toLowerCase() == name.toLowerCase() ||
          e.aliases.includes(name.toLowerCase())
        ) {
          return e;
        }
      });

      return e;
    },

    getItems: () => {
      return items;
    },
    getItemFromArray: (array, itemName) => {
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
    },

    giveUserItem: async (id, i, amount) => {
      var config = await bot.economy.getConfig(id);

      var item = bot.economy.getItemFromArray(config.items, i);
      var a = bot.economy.getItem(i);
      if (!item) {
        config.items.push({
          name: a.name,
          amount: amount,
          level: 0,
        });
      } else {
        config.items[item.index].amount += amount;
      }
      console.log(config);
      await config.save();
    },

    giveUserCredits: async (id, amount) => {
      var config = await bot.economy.getConfig(id);
      config.coinsInWallet += amount;
      config.markModified("pets");
      await config.save();
    },

    takeUserCredits: async (id, amount) => {
      var config = await bot.economy.getConfig(id);
      config.coinsInWallet -= amount;
      config.markModified("pets");
      await config.save();
    },

    takeUserItem: async (id, item, amount) => {
      var config = await bot.economy.getConfig(id);
      var item = await bot.economy.getItemFromArray(config.items, item);
      if (!item) {
        return;
      } else {
        config.items[item.index].amount -= amount;
      }

      if (config.items[item.index].amount <= 0) {
        config.items.splice(item.index, 1);
      }

      await config.save();
    },
  };
};
