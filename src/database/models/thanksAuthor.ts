import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: String,
  Author: String,
});

export default mongoose.model('thanksAuthor', Schema);
