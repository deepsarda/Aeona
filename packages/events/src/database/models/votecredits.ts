import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: String,
  Credits: Number,
  Unlimited: Boolean,
  LastVersion: String,
});

export default mongoose.model('votecredits', Schema);
