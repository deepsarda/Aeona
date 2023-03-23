import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Role: String,
  Logs: String,
});

export default mongoose.model('verify', Schema);
