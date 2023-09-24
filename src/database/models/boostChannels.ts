import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  boostMessage: String,
  unboostMessage: String,
});

export default mongoose.model('boostChannels', Schema);
