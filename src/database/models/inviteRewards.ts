import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Invites: Number,
  Role: String,
});

export default mongoose.model('inviteRewards', Schema);
