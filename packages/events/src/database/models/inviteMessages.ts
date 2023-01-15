import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  inviteJoin: String,
  inviteLeave: String,
});

export default mongoose.model('inviteMessages', Schema);
