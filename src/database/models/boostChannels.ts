import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  boostMessage: String,
  unboostMessage: String,
});

export default mongoose.model('boostChannels', Schema);
