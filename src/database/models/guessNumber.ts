import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Number: { type: String, default: '5126' },
});

export default mongoose.model('guessNumber', Schema);
