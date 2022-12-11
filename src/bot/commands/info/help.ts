import { AmethystBot, Context, Components } from '@thereallonewolf/amethystframework';
import { SelectOption } from 'discordeno';
export default {
	name: 'help',
	description: 'See the commands',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const options: SelectOption[] = [];
		const comp = new Components();

		client.category.forEach((c) => {
			options.push({
				label: `${client.extras.capitalizeFirstLetter(c.name)}`,
				value: `${c.name}`,
				description: `${c.description}`,
			});
		});

		comp.addSelectComponent('Choose which commands to see', 'help_select', options);
		client.extras.embed(
			{
				title: `My Help menu!`,
				desc: `Oh, Hi there. <:kanna_wave:805054424267096124> 
Let me help you get your server going.	

**Want to setup chatbot?**
Use \`+setup chatbot <channel>\` or
\`+autosetup chatbot\` to have me make a channel for you.

**Want to setup bump reminder?**
Well then run \`+bumpreminder setup <channel> <role>\`

**Want to generate some art?**
Use \`+imagine <prompt>\`
	
Use the dropdown to see all my commands.
				`,
				components: comp,
				type: 'reply',
			},
			ctx,
		);
	},
};
