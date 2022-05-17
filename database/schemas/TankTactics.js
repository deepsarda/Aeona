const mongoose = require("mongoose");

const TankTacticsSchema = mongoose.Schema({
  users: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
  channelId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  open: {
    type: mongoose.SchemaTypes.Boolean,
    default: true,
  },
  logs: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
  event: {
    nextType: {
      type: mongoose.SchemaTypes.String,
      default: "wait",
    },
    nextTimestamp: {
      type: mongoose.SchemaTypes.String,
      default: "",
    },
  },
  boardSize: {
    type: mongoose.SchemaTypes.Number,
    default: 32,
  },
  seed: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
});

module.exports = mongoose.model("TankTactics", TankTacticsSchema);
