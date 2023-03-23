import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Content: String,
  LastMessage: String,
});

export default mongoose.model('stickymessages.js', Schema);
