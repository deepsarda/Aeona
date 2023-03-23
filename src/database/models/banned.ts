import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  ID: String,
});

export default mongoose.model('banned', Schema);
