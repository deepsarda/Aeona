import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	Prefix: String,
});

export default mongoose.model('guild', Schema);
