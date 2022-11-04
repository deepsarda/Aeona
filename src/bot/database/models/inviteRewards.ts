import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	Invites: Number,
	Role: String,
});

export default mongoose.model('inviteRewards', Schema);
