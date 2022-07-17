const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "work",
  description: "Go to work and earn money",
  category: "economy",
  usage: "+work",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    let replies = [
      "Programmer",
      "Builder",
      "Waiter",
      "Busboy",
      "Chief",
      "Mechanic",
      "Janitor",
      "Security Guard",
      "Security Officer",
      "Accountant",
      "Banker",
      "Taxi Driver",
      "Delivery Driver",
      "Courier",
      "Teacher",
      "Librarian",
      "Nurse",
      "Doctor",
      "Lawyer",
      "Psychologist",
      "Psychiatrist",
      "Dentist",
      "Surgeon",
      "Veterinarian",
      "Physician",
      "Pharmacist",
      "Chiropractor",
      "Optometrist",
      "Optician",
    ];
    let result = Math.floor(Math.random() * replies.length);
    let amount = Math.floor(Math.random() * 15000) + 100000;
    message.reply({
      msg: message,
      description: ` You worked as a ${replies[result]} and earned ${amount} credits`,
    });

    profile.coinsInWallet += amount;
    profile.save();
  },
};
