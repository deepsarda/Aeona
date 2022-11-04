import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	Channel: String,
	Mode: { type: String, default: 'hard' },
});

export default mongoose.model('countChannel', Schema);
