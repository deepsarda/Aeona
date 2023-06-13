import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  User: String,
  Birthday: String,
  Date: String,
});

export default mongoose.model('birthday', Schema);
