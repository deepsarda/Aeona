import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: String,
  TicketID: Number,
  channelID: String,
  creator: String,
  claimed: String,
  resolved: { type: Boolean, default: false },
});

export default mongoose.model('ticketChannels', Schema);
