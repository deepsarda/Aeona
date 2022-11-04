import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'unban',
	description: 'Unban a user',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'userId',
			description: 'The ID of the user you want to unban',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['BAN_MEMBERS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		client.helpers
			.unbanMember(ctx.guild.id, ctx.options.getString('userId', true))
			.then(function () {
				client.extras.succNormal(
					{
						text: 'The specified user has been successfully unbanned!',
						type: 'editreply',
					},
					ctx,
				);
			})
			.catch(function () {
				return client.extras.errNormal(
					{
						error: `I could not find the user!`,
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
