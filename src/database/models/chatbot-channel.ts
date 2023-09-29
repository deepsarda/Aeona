import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Smart: { type: Boolean, required: false, default: false },
});

export default mongoose.model('chatbot', Schema);
