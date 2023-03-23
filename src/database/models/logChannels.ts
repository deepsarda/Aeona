import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  LastLog: String,
});

export default mongoose.model('logChannels', Schema);
