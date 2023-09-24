import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Words: Array,
});

export default mongoose.model('blacklist-words', Schema);
