import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { beautify } from 'js-beautify';
import { stripIndents } from 'common-tags';
export default {
	name: 'beautify',
	description: 'Beautify your code',
	commandType: ['application', 'message'],
	category: 'code',
	args: [
		{
			name: 'lang',
			description: 'Langauge of the code',
			required: true,
			type: 'String',
		},
		{
			name: 'code',
			description: 'Code to beautify',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const lang = await ctx.options.getString('lang', true);
		const code = await ctx.options.getLongString('code', true);

		ctx.reply(stripIndents`
		\`\`\`${lang || 'js'}
		${beautify(code)}
		\`\`\`
	`);
	},
};
