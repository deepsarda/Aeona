import Schema from '../../database/models/votecredits.js';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'news',
	description: 'Get the lastest news about Aeona',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let user = await Schema.findOne({ User: ctx.user.id });
		if (!user) user = new Schema({ User: ctx.user.id });
		user.LastVersion = client.extras.version;
		user.save();

		client.extras.embed(
			{
				title: `Changelog for ${client.extras.version}`,
				desc: `Hello there <a:wave:1049348090244636683>, I have been killing some bugs right now. Why dont we see them?`,
				fields: [
					{
						name: '→ :frame_photo: AI Image Generator',
						value: `Updated the A>I`,
						inline: true,
					},
					{
						name: '→ <:chatbot:1049292165282541638> Updated Chatbot',
						value: `The chatbot now uses more emojies!`,
						inline: true,
					},
					{
						name: '→ <:F_Moderation:1049289033374781471> Bug Fixs',
						value: `Improvements to the help command and reorganising of the files to better show `,
						inline: true,
					},
					{
						name: '→ <:channel:1049292166343688192> clock stats should now work better',
						value: `We will continue to monitor this.`,
						inline: true,
					},
					{
						name: '→  🔞 🪲  Removes loads of bugs',
						value: `Member leave logs should now work better.`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
