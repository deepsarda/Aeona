import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Message: String,
  Category: String,
  Roles: Object,
});

export default mongoose.model('reactionRoles', Schema);
