import Schema from '../../database/models/birthday.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'delete',
	description: 'Delete your birthday from me',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		Schema.findOne({ Guild: ctx.guildId, User: ctx.user.id }, async (err, data) => {
			if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);

			if (!data)
				return client.extras.errNormal(
					{
						error: 'No birthday found!',
						type: 'reply',
					},
					ctx,
				);

			Schema.findOneAndDelete({
				Guild: ctx.guildId,
				User: ctx.user.id + '',
			}).then(() => {
				client.extras.succNormal(
					{
						text: 'Deleted your birthday',
						type: 'reply',
					},
					ctx,
				);
			});
		});
	},
};
