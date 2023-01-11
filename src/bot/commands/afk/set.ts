import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/afk.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'set',
	description: 'Set your AFK',
	commandType: ['application', 'message'],
	category: 'afk',
	args: [
		{
			name: 'reason',
			description: 'Why you are going afk. Example: To eat dinner.',
			type: 'String',
			required: false,
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const reason = ctx.options.getLongString('reason') || `Not specified`;
		Schema.findOne({ Guild: ctx.guild!.id, User: ctx.user.id }, async (err, data) => {
			if (data) {
				return client.extras.errNormal(
					{
						error: `You're already afk!`,
						type: 'reply',
					},
					ctx,
				);
			} else {
				if (!ctx.guild || !ctx.user || !ctx.channel) return;

				new Schema({
					Guild: ctx.guild!.id,
					User: ctx.user.id + '',
					Message: reason,
				}).save();

				let nick = ctx.user.username;
				if (ctx.member?.nick) nick = ctx.member.nick;
				if (!ctx.guild!.id) return;
				if (nick.includes(`[AFK] `)) {
					client.helpers.editMember(ctx.guild!.id, ctx.user.id + '', {
						nick: `[AFK] ` + ctx.member?.nick,
					});
				}

				client.extras.embed(
					{
						title: `Your AFK has been set up succesfully`,
						desc: '',
						type: 'ephemeral',
					},
					ctx,
				);

				client.extras.embed(
					{
						title: '',
						desc: `<@${ctx.user.id}> is now afk! **Reason:** ${reason}`,
						type: '',
					},
					ctx.channel,
				);
			}
		});
	},
} as CommandOptions;
