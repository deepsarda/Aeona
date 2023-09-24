import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: String,
  Count: Number,
});

export default mongoose.model('count', Schema);
