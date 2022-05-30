const mongoose = require("mongoose");

const EconomySchema = mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  money: {
    wallet: {
      type: mongoose.SchemaTypes.Number,
      default: 10000,
    },
    bank: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    maxBank: {
      type: mongoose.SchemaTypes.Number,
      default: 100000,
    },
  },
  items: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },

  kills: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },

  wins: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },

  gameplayed: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  deaths: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  donations: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  heals: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  moves: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  rank: {
    type: mongoose.SchemaTypes.String,
    default: "Noob",
  },
});

module.exports = mongoose.model("Economy", EconomySchema);
