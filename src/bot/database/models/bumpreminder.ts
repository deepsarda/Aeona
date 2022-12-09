import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	Channel: String,
	Role: String,
	Message: String,
	LastBump: Number,
});

export default mongoose.model('bumpreminder', Schema);
