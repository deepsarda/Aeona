import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	User: { type: String },
	FLAGS: { type: Array },
});

export default mongoose.model('badges', Schema);
