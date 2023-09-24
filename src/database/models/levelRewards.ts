import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Level: Number,
  Role: String,
});

export default mongoose.model('levelRewards', Schema);
