import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Messages: Number,
  Role: String,
});

export default mongoose.model('messageRewards', Schema);
