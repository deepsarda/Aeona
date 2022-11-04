import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Count: Number,
});

export default mongoose.model('count', Schema);
