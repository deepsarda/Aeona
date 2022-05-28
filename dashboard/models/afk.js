const mongoose = require("mongoose");

const AFKSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  guildID: {
    type: String,
    required: true
  },
  message: {
      type: String,
      default: "AFK"
  }
})

const AFK = mongoose.model("AFK", AFKSchema);

module.exports = AFK;