import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'help',
	description: 'See the commands',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const fields: Field[] = [];

		client.category.forEach((c) => {
			if (c.uniqueCommands) {
				fields.push({
					name: '➯ ' + c.description,
					value: c.commands.map((c) => `\`${process.env.PREFIX!}${c.name}\`  ${c.mention}`).join(' '),
				});
			} else {
				let value = `\`${process.env.PREFIX!}${c.name} <`;
				c.commands.forEach((command) => {
					if (value.endsWith('<')) value += `${command.name}`;
					else value += `/${command.name}`;
				});
				value += '>` \n Slash Equivalents: ';
				c.commands.forEach((command) => {
					value += `${command.mention} `;
				});

				fields.push({
					name: '➯ ' + c.description,
					value: value,
				});
			}
		});

		client.extras.embed(
			{
				title: `My Help menu!`,
				fields: fields,
				type: 'reply',
			},
			ctx,
		);
	},
};

type Field = {
	name: string;
	value: string;
	inline?: boolean;
};
