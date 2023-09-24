import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  word: { type: String, default: 'start' },
});

export default mongoose.model('guessWord', Schema);
