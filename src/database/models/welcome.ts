import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Role: String,
  Message: String,
});

export default mongoose.model('welcomeChannels', Schema);
