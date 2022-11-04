import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	User: String,
	Parent: { type: Array, default: null },
	Partner: { type: String, default: null },
	Children: { type: Array, default: null },
});

export default mongoose.model('family', Schema);
