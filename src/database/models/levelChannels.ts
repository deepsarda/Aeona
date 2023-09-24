import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Message: String,
  Channel: { type: String, required: true },
});

export default mongoose.model('levelmessage', Schema);
