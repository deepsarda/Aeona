import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	User: String,
	Credits: Number,
	Unlimited: Boolean,
});

export default mongoose.model('votecredits', Schema);
