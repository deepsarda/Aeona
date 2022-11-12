import Schema from '../../database/models/stickymessages.js';

import { AmethystBot, AmethystEmbed, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'stick',
	description: 'Stick a message to be the last message in the channel',
	commandType: ['application', 'message'],
	category: 'stickymessages',
	args: [{
		name:'channel',
		description: 'The channel you want to stick the message to',
		type: 'Channel',
        required: true
	},{
		name:'message',
        description: 'The message you want to stick',
        type: 'String',
        required: true
	}],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const channel = await ctx.options.getChannel('channel',true);
		const content = await ctx.options.getLongString('message',true);

		const embed = new AmethystEmbed().setDescription(`${content}`).setColor(client.extras.config.colors.normal);
		client.helpers.sendMessage(channel.id,{ embeds: [embed] }).then((msg) => {
			Schema.findOne({ Guild: ctx.guildId, Channel: channel.id }, async (err, data) => {
				if (data) {
					data.Channel = channel.id;
					data.Content = content;
					data.LastMessage = msg.id;
					data.save();
				} else {
					new Schema({
						Guild: ctx.guildId,
						Channel: channel.id,
						LastMessage: msg.id,
						Content: content,
					}).save();
				}
			});

			client.extras.succNormal(
				{
					text: 'Sticky message created',
					fields: [
						{
							name: `→ Message`,
							value: `${content}`,
						},
					],
					type: 'editreply',
				},
				ctx,
			);
		});
	},
};
