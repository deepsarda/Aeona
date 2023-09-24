import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Content: String,
  LastMessage: String,
});

export default mongoose.model('stickymessages.js', Schema);
