import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Channel: String,
  Count: String,
});

export default mongoose.model('countChannel', Schema);
