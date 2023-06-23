import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  User: { type: String },
  Guild: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() },
});

export default mongoose.model('Levels', Schema);
