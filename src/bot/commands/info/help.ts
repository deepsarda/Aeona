import { Context, Components, CommandOptions } from '@thereallonewolf/amethystframework';
import { SelectOption } from 'discordeno';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'help',
	description: 'See the commands',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let options: SelectOption[] = [];
		const comp = new Components();
		console.log(client.category.size);
		try {
			client.category.forEach((c) => {
				options.push({
					label: `${client.extras.capitalizeFirstLetter(c.name)}`,
					value: `${c.name}`,
					description: `${c.description}`,
				});
			});
			const options2 = options.slice(0, options.length / 2);
			options = options.slice(options.length / 2);
			comp.addSelectComponent('Choose which commands to see. (1/2)', 'help_select', options2);
			comp.addSelectComponent('Choose which commands to see. (2/2)', 'help_select1', options);
			client.extras.embed(
				{
					title: `My Help menu!`,
					desc: `Oh, Hi there. <:kanna_wave:1053256324084928562> 
Let me help you get your server going.	

**Want to setup chatbot?**
Use \`+setup chatbot <channel>\` or
\`+autosetup chatbot\` to have me make a channel for you.

**Want to setup bump reminder?**
Well then run \`+bumpreminder setup <channel> <role>\`

**Want to generate some art?**
Use \`+imagine <prompt>\`

Our hosting partner and premium hosting provider.
:Indionic: **__IndionicHost__ - Think, Build and Deploy**
\`+sponser\` to see more about them.

Use the dropdown to see all my commands.
				`,
					components: comp,
					type: 'reply',
				},
				ctx,
			);
		} catch (e) {
			console.log(e);
		}
	},
} as CommandOptions;
