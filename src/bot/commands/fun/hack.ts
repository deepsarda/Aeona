import generator from 'generate-password';
import fetch from 'node-fetch';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'hack',
	description: 'Hack a user',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user to hack',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const password = generator.generate({
			length: 10,
			symbols: true,
			numbers: true,
		});

		const user = await ctx.options.getUser('user', true);
		function wait(ms: number) {
			const start = new Date().getTime();
			let end = start;
			while (end < start + ms) {
				end = new Date().getTime();
			}
		}

		client.extras
			.embed(
				{
					title: 'Hacking',
					desc: `The hack on <@${user.id}> started...`,
					type: 'reply',
				},
				ctx,
			)
			.then((msg) => {
				wait(140);
				client.extras
					.editEmbed(
						{
							title: 'Hacking',
							desc: `Searching for user information..`,
						},
						msg,
					)
					.then((_i: any) => {
						wait(133);
						client.extras
							.editEmbed(
								{
									title: 'Hacking',
									desc: `Searching for IP address...`,
								},
								msg,
							)
							.then((_i: any) => {
								wait(140);
								client.extras
									.editEmbed(
										{
											title: 'Hacking',
											desc: `The users ip address was found!`,
											fields: [
												{
													name: '→ IP Adress',
													value: `\`\`\`127.0.0.1\`\`\``,
													inline: true,
												},
											],
										},
										msg,
									)
									.then((_i: any) => {
										wait(60);
										client.extras
											.editEmbed(
												{
													title: 'Hacking',
													desc: `Searching for Discord login...`,
												},
												msg,
											)
											.then((_i: any) => {
												wait(230);
												client.extras
													.editEmbed(
														{
															title: 'Hacking',
															desc: `The users discord login was found!`,
															fields: [
																{
																	name: 'Email',
																	value: `\`\`\`${user.username}isCoolXD@gmail.com\`\`\``,
																},
																{
																	name: 'Password',
																	value: `\`\`\`${password}\`\`\``,
																},
															],
														},
														msg,
													)
													.then((_i: any) => {
														wait(200);
														client.extras
															.editEmbed(
																{
																	title: 'Hacking',
																	desc: `Search for Discord token...`,
																},
																msg,
															)
															.then((_i: any) => {
																wait(200);
																fetch(`https://some-random-api.ml/bottoken`)
																	.then((res) => res.json())
																	.catch()
																	.then(async (json: any) => {
																		client.extras
																			.editEmbed(
																				{
																					title: 'Hacking',
																					desc: `Found user token...`,
																					fields: [
																						{
																							name: 'Token',
																							value: `\`\`\`${json.token}\`\`\``,
																							inline: true,
																						},
																					],
																				},
																				msg,
																			)
																			.then((_i: any) => {
																				wait(140);
																				client.extras
																					.editEmbed(
																						{
																							title: 'Hacking',
																							desc: `Reporting account to Discord for breaking TOS...`,
																						},
																						msg,
																					)
																					.then((_i: any) => {
																						wait(180);
																						client.extras.succNormal(
																							{
																								text: `${user} is succesfully hacked.`,
																								type: 'edit',
																							},
																							ctx,
																						);
																					});
																			});
																	})
																	.catch();
															});
													});
											});
									});
							});
					});
			});
	},
} as CommandOptions;
