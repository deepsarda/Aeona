import MarkovGen from 'markov-generator';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'revive',
	description: 'Set a reminder',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const msgs = (
			await client.helpers.getMessages(ctx.channel.id, {
				limit: 100,
			})
		)
			.filter((msg) => msg.content.length > 0)
			.map((msg) => msg.content);

		const markov = new MarkovGen({
			input: msgs,
			minLength: 10,
		});
		client.helpers.sendMessage(ctx.channel.id, {
			content: markov.makeChain(),
		});
	},
};
