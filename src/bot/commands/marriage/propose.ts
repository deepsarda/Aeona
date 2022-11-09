import Schema from '../../database/models/family.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'propose',
	description: 'Propose to a user',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'The user to propose',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = ctx.options.getUser('user', true);
		const author = ctx.user;
		const guild = { Guild: ctx.guildId };
		console.log(`Proposal by ${target}`);
		if (author.id == target.id)
			return client.extras.errNormal({ error: 'You cannot marry yourself!', type: 'editreply' }, ctx);

		Schema.findOne({ Guild: ctx.guildId, Partner: author.id }, async (err: any, data: any) => {
			if (data) {
				client.extras.errNormal(
					{
						error: 'Someone in the couple is already married!',
						type: 'editreply',
					},
					ctx,
				);
			} else {
				Schema.findOne({ Guild: ctx.guildId, Partner: target.id }, async (err: any, data: any) => {
					if (data) {
						client.extras.errNormal(
							{
								error: 'Someone in the couple is already married!',
								type: 'editreply',
							},
							ctx,
						);
					} else {
						Schema.findOne(
							{
								Guild: ctx.guildId,
								User: target.id,
								Parent: author.id,
							},
							async (err: any, data: any) => {
								if (data) {
									client.extras.errNormal(
										{
											error: 'You cannot marry a family member!',
											type: 'editreply',
										},
										ctx,
									);
								} else {
									Schema.findOne(
										{
											Guild: ctx.guildId,
											User: author.id,
											Parent: target.id,
										},
										async (err: any, data: any) => {
											if (data) {
												client.extras.errNormal(
													{
														error: 'You cannot marry a family member!',
														type: 'editreply',
													},
													ctx,
												);
											} else {
												Schema.findOne(
													{ Guild: ctx.guildId, User: author.id },
													async (err: any, data: { Children: bigint[] }) => {
														if (data) {
															if (data.Children.includes(target.id)) {
																client.extras.errNormal(
																	{
																		error: 'You cannot marry a family member!',
																		type: 'editreply',
																	},
																	ctx,
																);
															} else {
																propose();
															}
														} else {
															propose();
														}
													},
												);
											}
										},
									);
								}
							},
						);
					}
				});
			}
		});

		async function propose() {
			const row = new Components()
				.addButton('Yes', 'Success', 'propose_accept', { emoji: '✅' })
				.addButton('No', 'Danger', 'propose_deny', { emoji: '❌' });

			const message = await client.extras.embed(
				{
					title: `Marriage proposal`,
					desc: `<@${author.id}> has <@${target.id}> asked to marry them! \n<@${target.id}> click on one of the buttons`,
					components: row,
					content: `<@${target.id}>`,
					type: 'editreply',
				},
				ctx,
			);

			const filter = (bot, i) => {
				console.log(i.user.id === target.id);
				return i.user.id === target.id;
			};

			client.amethystUtils
				.awaitComponent(message.id, {
					filter: filter,
					type: 'Button',
				})
				.then(async (i) => {
					console.log(i);
					if (i.data?.customId == 'propose_accept') {
						Schema.findOne(
							{ Guild: ctx.guildId, User: author.id },
							async (err: any, data: { Partner: bigint; save: () => void }) => {
								if (data) {
									data.Partner = target.id;
									data.save();
								} else {
									new Schema({
										Guild: ctx.guildId,
										User: author.id,
										Partner: target.id,
									}).save();
								}
							},
						);

						Schema.findOne(
							{ Guild: ctx.guildId, User: target.id },
							async (err: any, data: { Partner: bigint; save: () => void }) => {
								if (data) {
									data.Partner = author.id;
									data.save();
								} else {
									new Schema({
										Guild: ctx.guildId,
										User: target.id,
										Partner: author.id,
									}).save();
								}
							},
						);

						client.extras.embed(
							{
								title: `Marriage proposal - Accepted`,
								desc: `${author} and <@${target.id}> are now married! 👰🎉`,
								components: [],
								content: `<@${target.id}>`,
								type: 'editreply',
							},
							ctx,
						);
					}

					if (i.data?.customId == 'propose_deny') {
						client.extras.embed(
							{
								title: `Marriage proposal - Declined`,
								desc: `<@${target.id}> loves someone else and chose not to marry ${author}`,
								components: [],
								content: `<@${target.id}>`,
								type: 'editreply',
							},
							ctx,
						);
					}
				})
				.catch((e) => {
					console.error(e);
					client.extras.embed(
						{
							title: `Marriage proposal - Declined`,
							desc: `<@${target.id}> has not answered anything! The wedding is canceled`,
							components: [],
							content: `<@${target.id}>`,
							type: 'editreply',
						},
						ctx,
					);
				});
		}
	},
};
