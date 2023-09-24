import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  inviteUser: String,
  User: String,
});

export default mongoose.model('inviteBy', Schema);
