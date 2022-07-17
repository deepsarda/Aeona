const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  badges: {
    type: Array,
    default: [],
  },
  rep: {
    type: Number,
    required: false,
  },
  lastVoted: { type: Number },
  votes: { type: Number },
  version: {
    type: String,
    default: "v6.0.0",
  },
});

module.exports = mongoose.model("User", userSchema);
