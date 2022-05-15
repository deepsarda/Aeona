const mongoose = require("mongoose");

const TankTacticsSchema = mongoose.Schema({
  gameId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  users: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
  messageId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  channelId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  open: {
    type: mongoose.SchemaTypes.Boolean,
    default: true,
  },
  public: {
    type: mongoose.SchemaTypes.Boolean,
    default: true,
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
});

module.exports = mongoose.model("TankTactics", TankTacticsSchema);
