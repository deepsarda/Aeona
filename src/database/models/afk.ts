import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: { type: String, required: true },
  Message: { type: String, default: false },
});

export default mongoose.model('afk', Schema);
