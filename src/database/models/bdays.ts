import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Action: String,
  Date: String,
});

export default mongoose.model('bdays.js', Schema);
