import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import inviteMessages from '../../database/models/inviteMessages.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'welcomemessage',
	description: 'Send a welcome message ',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'message',
			description: '<message>/help/default',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const message = ctx.options.getLongString('message', true);
		if (!message) return;
		if (message.toUpperCase() == 'HELP') {
			return client.extras.embed(
				{
					title: `Welcome message options`,
					desc: `Join message options: \n
            \`{user:username}\` - User's username
            \`{user:discriminator}\` - User's discriminator
            \`{user:tag}\` - User's tag
            \`{user:mention}\` - Mention a user

            \`{inviter:username}\` - inviter's username
            \`{inviter:discriminator}\` - inviter's discriminator
            \`{inviter:tag}\` - inviter's tag
            \`{inviter:mention}\` - inviter's mention
            \`{inviter:invites}\` - inviter's invites
            \`{inviter:invites:left}\` - inviter's left invites
                    
            \`{guild:name}\` - Server name
            \`{guild:members}\` - Server members count`,
					type: 'reply',
				},
				ctx,
			);
		}

		if (message.toUpperCase() == 'DEFAULT') {
			inviteMessages.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
				if (data) {
					data.inviteJoin = null;
					data.save();

					client.extras.succNormal(
						{
							text: `Welcome message deleted!`,
							type: 'reply',
						},
						ctx,
					);
				}
			});
		} else {
			inviteMessages.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
				if (data) {
					data.inviteJoin = message;
					data.save();
				} else {
					new inviteMessages({
						Guild: ctx.guild!.id,
						inviteJoin: message,
					}).save();
				}

				client.extras.succNormal(
					{
						text: `The welcome message has been set successfully`,
						fields: [
							{
								name: `💬 Message`,
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
} as CommandOptions;
