import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: String,
  Invites: Number,
  Total: Number,
  Left: Number,
});

export default mongoose.model('invites', Schema);
