import { AeonaBot } from '../../extras/index.js';
import Schema from '../../database/models/tempban.js';

export default (client: AeonaBot) => {
	const checkForExpired = async () => {
		const now = new Date();

		const condition = {
			expires: {
				$lt: now,
			},
		};

		const results = await Schema.find(condition);

		if (results) {
			for (const result of results) {
				const { guildId, userId } = result;

				const guild = await client.cache.guilds.get(BigInt(guildId!));
				if (guild) {
					client.helpers.unbanMember(guildId!, userId!);
				}
			}

			await Schema.deleteMany(condition);
		}

		setTimeout(checkForExpired, 1000 * 10);
	};

	checkForExpired();
};
