import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: String,
  Messages: Number,
});

export default mongoose.model('messages', Schema);
