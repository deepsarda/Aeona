import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Warns: Number,
});

export default mongoose.model('warnings', Schema);
