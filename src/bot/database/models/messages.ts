import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Messages: Number,
});

export default mongoose.model('messages', Schema);
