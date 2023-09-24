import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Category: String,
  Role: String,
  Channel: { type: String, required: true },
  Logs: String,
  TicketCount: { type: Number, default: 0 },
});

export default mongoose.model('tickets', Schema);
