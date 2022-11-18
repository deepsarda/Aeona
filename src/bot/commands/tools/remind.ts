import Schema from '../../database/models/reminder.js';
import ms from 'ms';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'remind',
	description: 'Set a reminder',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const time = ctx.options.getString('time', true);
		const text = ctx.options.getLongString('message', true);

		const endtime = new Date().getTime() + ms(time);

		Schema.findOne({ Text: text, User: ctx.user.id, endTime: endtime }, async (err, data) => {
			if (data) {
				return client.extras.errNormal({ error: `You already made this reminder!`, type: 'editreply' }, ctx);
			} else {
				return client.extras.succNormal(
					{
						text: `Your reminder is set!`,
						fields: [
							{
								name: `End Time`,
								value: `${new Date(endtime).toLocaleTimeString()}`,
								inline: true,
							},
							{
								name: `→ Reminder`,
								value: `${text}`,
								inline: true,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			}
		});

		setTimeout(async () => {
			client.extras.embed(
				{
					title: `Reminder`,
					desc: `Your reminder just ended!`,
					fields: [
						{
							name: `→ Reminder`,
							value: `${text}`,
							inline: true,
						},
					],
				},
				ctx.user,
			);

			const deleted = await Schema.findOneAndDelete({
				Text: text,
				User: ctx.user.id,
				endTime: endtime,
			});
		}, endtime - new Date().getTime());
	},
};
