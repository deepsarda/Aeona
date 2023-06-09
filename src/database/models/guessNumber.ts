import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Number: { type: String, default: '5126' },
});

export default mongoose.model('guessNumber', Schema);
