import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Message: { type: String, default: false },
});

export default mongoose.model('afk', Schema);
