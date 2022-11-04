import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	openTicket: String,
	dmMessage: String,
});

export default mongoose.model('ticketMessage', Schema);
