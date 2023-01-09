import mongoose from 'mongoose';

import functions from './dist/bot/database/models/functions.js';

mongoose.connect('mongodb+srv://aeona:IngtzBv0W0O8opfU@cluster0.ihausmo.mongodb.net/FreyaBot');
mongoose.connection.once('open', async () => {
	console.log(`Mongoose is ready!`);
	try {
		let guilds = await functions.find({});
		console.log(guilds.length);
		for (let i = 0; i < guilds.length; i++) {
			if (
				(guilds[i].isPremium == undefined || guilds[i].isPremium == 'no') &&
				guilds[i].Levels !== true &&
				guilds[i].AntiAlt !== true &&
				guilds[i].AntiCaps !== true &&
				guilds[i].AntiInvite !== true &&
				guilds[i].AntiLinks !== true &&
				guilds[i].AntiSpam !== true &&
				(guilds[i].Prefix == undefined || guilds[i].Prefix == '+' || guilds[i].Prefix == ',')
			) {
				guilds[i].delete();
				guilds[i] = null;
			}
		}
		guilds = guilds.filter((guild) => guild != null);
		console.log(guilds.length);
	} catch (e) {
		console.log('HMMM');
		console.error(e);
	}
});
