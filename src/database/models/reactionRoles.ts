import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Message: String,
  Category: String,
  Roles: Object,
});

export default mongoose.model('reactionRoles', Schema);
