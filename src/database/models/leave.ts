import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Message: String,
});

export default mongoose.model('leaveChannels.js', Schema);
