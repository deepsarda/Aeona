const mongoose = require("mongoose");

const EconomySchema = new mongoose.Schema({
  userId: { type: String, required: false, unique: true },
  coinsInWallet: { type: Number, required: false, default: 100000 },
  coinsInBank: { type: Number, required: false, default: 500 },
  bankSpace: { type: Number, required: false, default: 2500 },
  items: { type: Array, required: false, default: [] },
  dailyStreak: {
    type: Date,
    required: false,
    default: new Date(Date.now() - 86400000),
  },
  passive: { type: Boolean, required: false, default: false },
  visiblePublic: { type: Boolean, required: false, default: true },
});

module.exports = mongoose.model("economy-aeona", EconomySchema);
