import bumpreminder from '../../database/models/bumpreminder.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'message',
	description: 'Set the bump message',
	commandType: ['application', 'message'],
	category: 'bumpreminder',
	args: [
		{
			name: 'message',
			description: '<message>/default',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const message = ctx.options.getLongString('message', true);
		if (!message) return;

		if (message.toUpperCase() == 'default') {
			bumpreminder.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (data) {
					data.Message = null;
					data.save();

					client.extras.succNormal(
						{
							text: `Bump message deleted!`,
							type: 'reply',
						},
						ctx,
					);
				}
			});
		} else {
			bumpreminder.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (!ctx.guild) return;
				if (data) {
					data.Message = message;
					data.save();
				} else {
					return client.extras.errNormal(
						{
							error: `Please first setup bumpreminder using \`+bumpreminder setup\`.`,
							type: 'reply',
						},
						ctx,
					);
				}

				client.extras.succNormal(
					{
						text: `The bump message has been set successfully`,
						fields: [
							{
								name: `→ Message`,
								value: `${message}`,
								inline: true,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			});
		}
	},
};
