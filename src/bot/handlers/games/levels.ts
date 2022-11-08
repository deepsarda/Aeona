import { AmethystBot } from '@thereallonewolf/amethystframework';
import levels from '../../database/models/levels.js';

export default async (client: AmethystBot) => {
	client.extras.setXP = async function (userId: bigint, guildId: bigint, xp: number) {
		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.xp = xp;
		user.level = Math.floor(0.1 * Math.sqrt(user.xp));
		user.lastUpdated = new Date();

		user.save();

		return user;
	};

	client.extras.setLevel = async function (userId: bigint, guildId: bigint, level: number) {
		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.level = level;
		user.xp = level * level * 100;
		user.lastUpdated = new Date();

		user.save();

		return user;
	};

	client.extras.addXP = async function (userId: bigint, guildId: bigint, xp: number) {
		const user = await levels.findOne({ userID: userId, guildID: guildId });

		if (!user) {
			new levels({
				userID: userId,
				guildID: guildId,
				xp: xp,
				level: Math.floor(0.1 * Math.sqrt(xp)),
			}).save();

			return Math.floor(0.1 * Math.sqrt(xp)) > 0;
		}

		user.xp += xp;
		user.level = Math.floor(0.1 * Math.sqrt(user.xp));
		user.lastUpdated = new Date();

		await user.save();

		return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
	};

	client.extras.addLevel = async function (userId: bigint, guildId: bigint, level: string) {
		const user = await levels.findOne({ userID: userId, guildID: guildId });
		if (!user) return false;

		user.level += parseInt(level, 10);
		user.xp = user.level * user.level * 100;
		user.lastUpdated = new Date();

		user.save();

		return user;
	};

	client.extras.fetchLevels = async function (userId: bigint, guildId: bigint, fetchPosition = true) {
		const user = await levels.findOne({
			userID: userId,
			guildID: guildId,
		});
		const userReturn = {
			...user,
			position: 0,
			cleanXp: 0,
			cleanNextLevelXp: 0,
		};
		if (!user) return false;

		if (fetchPosition === true) {
			const leaderboard = await levels
				.find({
					guildID: guildId,
				})
				.sort([['xp', -1]])
				.exec();

			userReturn.position = leaderboard.findIndex((i) => i.userID === userId+"") + 1;
		}

		userReturn.cleanXp = user.xp - client.extras.xpFor(user.level);
		userReturn.cleanNextLevelXp = client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);

		return user;
	};

	client.extras.xpFor = function (targetLevel: number) {
		return targetLevel * targetLevel * 100;
	};
};
