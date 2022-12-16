import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import { Linter } from 'eslint';
const linter = new Linter();
const rules = linter.getRules();
export default {
	name: 'lint-rule',
	description: 'Responds with information on an ESLint rule.',
	commandType: ['application', 'message'],
	category: 'code',
	args: [
		{
			name: 'rule',
			description: 'Which rule would you like to get information on?',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const rule = await ctx.options.getLongString('rule', true);
		rule.replaceAll(' ', '-');
		if (!rules.has(rule))
			return client.extras.errNormal(
				{
					error: 'I was unable to find that ESLint rule.',
					type: 'reply',
				},
				ctx,
			);
		const data = rules.get(rule).meta;
		await client.extras.embed(
			{
				title: `${rule} (${data.docs.category})`,
				desc: data.docs.description + '\n (Link to the docs)[' + `https://eslint.org/docs/rules/${rule}` + ']',
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
