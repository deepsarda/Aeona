import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Messages: Number,
  Role: String,
});

export default mongoose.model('messageRewards', Schema);
