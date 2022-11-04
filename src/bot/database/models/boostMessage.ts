import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	boostMessage: String,
	unboostMessage: String,
});

export default mongoose.model('boostMessage.js', Schema);
