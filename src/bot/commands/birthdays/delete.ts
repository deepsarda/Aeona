import Schema from '../../database/models/birthday.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'delete',
	description: 'Delete your birthday from me',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		Schema.findOne({ Guild: ctx.guild!.id, User: ctx.user.id }, async (err, data) => {
			if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

			if (!data)
				return client.extras.errNormal(
					{
						error: 'No birthday found!',
						type: 'reply',
					},
					ctx,
				);

			Schema.findOneAndDelete({
				Guild: ctx.guild!.id,
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
} as CommandOptions;
