import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: String,
  Warns: Number,
});

export default mongoose.model('warnings', Schema);
