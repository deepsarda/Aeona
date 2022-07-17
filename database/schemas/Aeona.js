const mongoose = require("mongoose");

const AeonaSchema = mongoose.Schema({
  news: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  tag: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  time: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  version: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

module.exports = mongoose.model("AeonaNews", AeonaSchema);
