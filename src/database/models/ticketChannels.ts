import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  TicketID: Number,
  channelID: String,
  creator: String,
  claimed: String,
  resolved: { type: Boolean, default: false },
});

export default mongoose.model('ticketChannels', Schema);
