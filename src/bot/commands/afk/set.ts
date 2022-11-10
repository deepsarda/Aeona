import Schema from '../../database/models/afk.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const reason = ctx.options.getString('reason') || `Not specified`;

		Schema.findOne({ Guild: ctx.guildId, User: ctx.user.id }, async (err, data) => {
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
					Guild: ctx.guildId,
					User: ctx.user.id + '',
					Message: reason,
				}).save();

				let nick = ctx.user.username;
				if (ctx.member?.nick) nick = ctx.member.nick;
				if (!ctx.guildId) return;
				if (nick.includes(`[AFK] `)) {
					client.helpers.editMember(ctx.guildId, ctx.user.id + '', {
						nick: `[AFK] ` + ctx.member?.nick,
					});
				}

				client.extras.succNormal(
					{
						text: `Your AFK has been set up succesfully`,
						type: 'ephemeral',
					},
					ctx,
				);

				client.extras.embed(
					{
						desc: `<@${ctx.user.id}> is now afk! **Reason:** ${reason}`,
					},
					ctx.channel,
				);
			}
		});
	},
};
