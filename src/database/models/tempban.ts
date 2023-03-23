import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  guildId: String,
  userId: String,
  expires: Date,
});

export default mongoose.model('tempban', Schema);
