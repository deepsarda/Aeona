import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'banlist',
	description: 'See the ban list',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [],
	userGuildPermissions: ['BAN_MEMBERS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.helpers
			.getBans(ctx.guild!.id)
			.then(async (banned) => {
				const list = banned.map(
					(banUser) =>
						`${banUser.user.username + '#' + banUser.user.discriminator} **Reason:** ${banUser.reason || 'No reason'}`,
				);

				if (list.length == 0)
					return client.extras.errNormal(
						{
							error: `This server has no bans`,
							type: 'reply',
						},
						ctx,
					);

				await client.extras.createLeaderboard(`🔧 Banlist - ${ctx.guild?.name}`, list, ctx);
			})
			.catch((error) => {
				throw error;
			});
	},
} as CommandOptions;
