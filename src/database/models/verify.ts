import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Role: String,
  Logs: String,
});

export default mongoose.model('verify', Schema);
