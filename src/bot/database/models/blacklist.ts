import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	Words: Array,
});

export default mongoose.model('blacklist-words', Schema);
