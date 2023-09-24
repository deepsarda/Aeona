import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: { type: String, required: true },
  Birthday: { type: String, required: true },
  Date: { type: String, required: true },
});

export default mongoose.model('birthday', Schema);
