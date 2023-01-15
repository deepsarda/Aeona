import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: String,
  Text: String,
  endTime: Number,
});

export default mongoose.model('reminder', Schema);
