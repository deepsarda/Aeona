import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  openTicket: String,
  dmMessage: String,
});

export default mongoose.model('ticketMessage', Schema);
