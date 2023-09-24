import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  LastLog: String,
});

export default mongoose.model('logChannels', Schema);
