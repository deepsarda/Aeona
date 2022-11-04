import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	Guild: String,
	inviteUser: String,
	User: String,
});

export default mongoose.model('inviteBy', Schema);
