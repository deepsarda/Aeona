import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Message: String,
});

export default mongoose.model('leaveChannels.js', Schema);
