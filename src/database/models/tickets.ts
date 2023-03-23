import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  Category: String,
  Role: String,
  Channel: String,
  Logs: String,
  TicketCount: { type: Number, default: 0 },
});

export default mongoose.model('tickets', Schema);
