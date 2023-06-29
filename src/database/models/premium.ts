import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  code: { type: mongoose.SchemaTypes.String, default: null },

  ExpiresAt: {
    type: mongoose.SchemaTypes.String,
    default: Date.now() + 2592000000,
  },

  Plan: { type: mongoose.SchemaTypes.String, default: null },
});

export default mongoose.model("codes", Schema);
