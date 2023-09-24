import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Count: String,
});

export default mongoose.model('countChannel', Schema);
