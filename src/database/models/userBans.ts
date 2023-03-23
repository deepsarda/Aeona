import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: String,
});

export default mongoose.model('userBans', Schema);
