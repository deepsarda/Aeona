import { AmethystBot } from '@thereallonewolf/amethystframework';

import moment from 'moment-timezone';

import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot) => {
	console.log("Updating clocks")
	try {
		const data = await Schema.find();

		if (data) {
			data.forEach(async (d) => {
				if (!d.TimeZone || !d.Time) return;
				try {
					const timeNow = moment().tz(d.TimeZone).format('HH:mm (z)');
					const guild = await client.cache.guilds.get(BigInt(d.Guild));

					let channelName = await client.extras.getTemplate(guild?.id);
					channelName = channelName.replace(`{emoji}`, '⏰');
					channelName = channelName.replace(`{name}`, `${timeNow}`);
					client.helpers.editChannel(d.Time, {
						name: channelName,
					});
				} catch (err) {
					console.log(err);
				}
			});
		}
	} catch (err) {
		console.log(err);
	}
};
