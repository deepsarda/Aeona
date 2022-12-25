import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'editembed',
	description: 'Edit an embed',
	commandType: ['application', 'message'],
	category: 'embed',
	args: [
		{
			name: 'channel',
			description: 'Channel in which the message is in.',
			required: true,
			type: 'Channel',
		},
		{
			name: 'messageid',
			description: 'Id of that message.',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const channel = await ctx.options.getChannel('channel', true);
		const messageId = ctx.options.getString('messageid', true);

		const message = await client.helpers.getMessage(channel.id, messageId);
		if (!message)
			return client.extras.errNormal(
				{
					error: 'No message found!',
					type: 'reply',
				},
				ctx,
			);

		if (!message.embeds || message.embeds.length == 0)
			return client.extras.errNormal(
				{
					error: 'That message has no embed.',
					type: 'reply',
				},
				ctx,
			);

		const embed = message.embeds[0];
		ctx.reply({ content: 'Send the title for the embed.' });

		const title = (await client.amethystUtils.awaitMessage(ctx.user.id, ctx.channel.id)).content;
		embed.title = title;

		ctx.reply({ content: 'Send the description for the embed.' });

		const description = (await client.amethystUtils.awaitMessage(ctx.user.id, ctx.channel.id)).content;
		embed.description = description;

		message.embeds[0] = embed;
		try {
			await client.helpers.editMessage(channel.id, messageId, {
				embeds: message.embeds,
			});

			ctx.reply({ content: 'Updated message.' });
		} catch (e) {
			return client.extras.errNormal(
				{
					error: 'Unable to update message. Was it sent by me?',
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
