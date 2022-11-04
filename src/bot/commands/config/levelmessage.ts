import Schema from '../../database/models/levelMessages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'levelmessage',
	description: 'Set the level up message',
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
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const message = ctx.options.getLongString('message', true);
		if (!message) return;

		if (message.toLowerCase() == 'help') {
			return client.extras.embed(
				{
					title: `Level message options`,
					desc: `These are the level message name options: \n
            \`{user:username}\` - User's username
            \`{user:discriminator}\` - User's discriminator
            \`{user:tag}\` - User's tag
            \`{user:mention}\` - Mention a user

            \`{user:level}\` - Users's level
            \`{user:xp}\` - Users's xp`,
					type: 'editreply',
				},
				ctx,
			);
		}

		if (message.toLowerCase() == 'default') {
			Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (data) {
					Schema.findOneAndDelete({ Guild: ctx.guildId }).then(() => {
						client.extras.succNormal(
							{
								text: `Level message deleted!`,
								type: 'editreply',
							},
							ctx,
						);
					});
				}
			});
		} else {
			Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (data) {
					data.Message = message;
					data.save();
				} else {
					new Schema({
						Guild: ctx.guildId,
						Message: message,
					}).save();
				}

				client.extras.succNormal(
					{
						text: `The level message has been set successfully`,
						fields: [
							{
								name: `→ Message`,
								value: `${message}`,
								inline: true,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			});
		}
	},
};
