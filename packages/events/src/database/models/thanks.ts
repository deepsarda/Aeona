import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: String,
  UserTag: String,
  Received: Number,
});

export default mongoose.model('thanks', Schema);
