import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channels: Array,
});

export default mongoose.model('channellist', Schema);
