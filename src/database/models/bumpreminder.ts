import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Role: String,
  Message: String,
  LastBump: Number,
});

export default mongoose.model('bumpreminder', Schema);
