import Schema from '../../database/models/stats.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'setstatchannelname',
	description: 'Sets the channel name for stats',
	commandType: ['application', 'message'],
	category: 'config',
	args: [
		{
			name: 'message',
			description: '<message>/help/default',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);

		const name = ctx.options.getLongString('name', true);
		if (!name) return;

		if (name.toUpperCase() == 'HELP') {
			return client.extras.embed(
				{
					title: `Channel name options`,
					desc: `These are the channel name options: \n
            \`{emoji}\` - Channel emoji
            \`{name}\` - Channel name`,
					type: 'reply',
				},
				ctx,
			);
		}

		Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
			if (data) {
				data.ChannelTemplate = name;
				data.save();
			} else {
				new Schema({
					Guild: ctx.guildId,
					ChannelTemplate: name,
				}).save();
			}

			client.extras.succNormal(
				{
					text: `The channel name has been set successfully`,
					fields: [
						{
							name: `→ Name`,
							value: `${name}`,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		});
	},
};
