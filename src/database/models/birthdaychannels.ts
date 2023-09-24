import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: false },
});

export default mongoose.model('birthdaychannels.js', Schema);
