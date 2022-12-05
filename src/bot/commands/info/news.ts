import Schema from '../../database/models/votecredits';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'news',
	description: 'Get the lastest news about Aeona',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await Schema.findOne({ User: ctx.user.id });
		user.LastVersion = client.extras.version;
		client.extras.embed(
			{
				title: `Changelog for ${client.extras.version}`,
				desc: `Hello there <a:wave:1049348090244636683>, I have undergone some <:F_Settings:1009877506775601303> changes and upgrades while you where gone. Why dont we see them?`,
				fields: [
					{
						name: '→ :frame_photo: AI Image Generator',
						value: `Get beautiful image generated across various styles using \`+imagine\``,
						inline: true,
					},
					{
						name: '→ <:chatbot:1049292165282541638> Updated Chatbot',
						value: `The main chatbot has been updated to no longer use commands and unknown emojies.`,
						inline: true,
					},
					{
						name: '→ <:F_Moderation:1049289033374781471> New AI powered chat reviver',
						value: `The main chatbot has been updated to no longer use commands and unknown emojies.`,
						inline: true,
					},
					{
						name: '→ <:channel:1049292166343688192> Loads of new anime reaction commands',
						value: `You can now react to anything. Also added 2 new coding help commands.`,
						inline: true,
					},
					{
						name: '→  🔞 🪲  Removes loads of bugs',
						value: `Logs should now work much better than before.`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
