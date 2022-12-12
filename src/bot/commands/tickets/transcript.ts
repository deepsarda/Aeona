
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'transcript',
	description: 'Generate a transcript of this chat',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const type = 'reply';

		return client.extras
			.simpleEmbed(
				{
					desc: `${client.extras.emotes.animated.loading} Transcript saving...`,
					type: type,
				},
				ctx,
			)
			.then(async (editMsg) => {
				client.extras.transcript(client, ctx.channel).then(() => {
					return client.extras.simpleEmbed(
						{
							desc: `Transcript saved`,
							type: 'editreply',
						},
						ctx,
					);
				});
			});
	},
};
