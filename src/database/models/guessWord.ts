import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  word: { type: String, default: 'start' },
});

export default mongoose.model('guessWord', Schema);
