import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Role: String,
});

export default mongoose.model('joinRole', Schema);
