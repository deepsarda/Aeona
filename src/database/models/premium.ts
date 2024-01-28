import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  code: { type: mongoose.SchemaTypes.String, default: null },

  ExpiresAt: {
    type: mongoose.SchemaTypes.String,
   default: null
  },

  Plan: { type: mongoose.SchemaTypes.String, default: null },
});

export default mongoose.model("codes", Schema);
