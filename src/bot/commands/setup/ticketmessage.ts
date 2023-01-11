import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/ticketMessage.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'ticketmessage',
	description: 'Configure the ticket system',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'type',
			description: 'Mode',
			choices: [
				{
					name: 'open',
					value: 'open',
				},
				{
					name: 'remove',
					value: 'remove',
				},
			],
			required: true,
			type: 'String',
		},
		{
			name: 'message',
			description: '<message>/default',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const type = ctx.options.getString('type', true);
		let message = ctx.options.getLongString('message', true);
		if (!message) return;
		message = message.replace(type, '');

		if (type == 'open') {
			if (message.toUpperCase() == 'DEFAULT') {
				const data = await Schema.findOne({ Guild: ctx.guild!.id });

				if (data) {
					data.openTicket =
						'Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close ticket \n✋ - Claim ticket \n📝 - Save transcript \n🔔 - Send a notification';
					data.save();

					client.extras.succNormal(
						{
							text: `The ticket message has been set successfully`,
							fields: [
								{
									name: `→ Message type`,
									value: `${type}`,
									inline: true,
								},
								{
									name: `→ Message`,
									value: `${data.openTicket}`,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				} else {
					client.extras.errNormal(
						{
							error: `No ticket message data found!`,
							type: 'reply',
						},
						ctx,
					);
				}

				return;
			}

			Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
				if (data) {
					data.openTicket = message;
					data.save();
				} else {
					new Schema({
						Guild: ctx.guild!.id,
						openTicket: message,
					}).save();
				}
			});

			client.extras.succNormal(
				{
					text: `The ticket message has been set successfully`,
					fields: [
						{
							name: `→ Message type`,
							value: `${type}`,
							inline: true,
						},
						{
							name: `→ Message`,
							value: `${message}`,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		} else if (type == 'close') {
			if (message.toUpperCase() == 'DEFAULT') {
				const data = await Schema.findOne({ Guild: ctx.guild!.id });

				if (data) {
					data.dmMessage = 'Here is the transcript for your ticket, please keep this if you ever want to refer to it!';
					data.save();

					client.extras.succNormal(
						{
							text: `The ticket message has been set successfully`,
							fields: [
								{
									name: `→ Message type`,
									value: `${type}`,
									inline: true,
								},
								{
									name: `→ Message`,
									value: `${data.dmMessage}`,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				} else {
					client.extras.errNormal(
						{
							error: `No ticket message data found!`,
							type: 'reply',
						},
						ctx,
					);
				}

				return;
			}

			Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
				if (data) {
					data.dmMessage = message;
					data.save();
				} else {
					new Schema({
						Guild: ctx.guild!.id,
						dmMessage: message,
					}).save();
				}
			});

			client.extras.succNormal(
				{
					text: `The ticket message has been set successfully`,
					fields: [
						{
							name: `→ Message type`,
							value: `${type}`,
							inline: true,
						},
						{
							name: `→ Message`,
							value: `${message}`,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
