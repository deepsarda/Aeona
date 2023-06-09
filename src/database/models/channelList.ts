import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channels: Array,
});

export default mongoose.model('channellist', Schema);
