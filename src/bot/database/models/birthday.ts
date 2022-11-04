import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Birthday: String,
});

export default mongoose.model('birthday', Schema);
