import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Level: Number,
  Role: String,
});

export default mongoose.model('levelRewards', Schema);
