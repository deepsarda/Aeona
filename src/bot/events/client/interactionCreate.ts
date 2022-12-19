import { AmethystEmbed, createContext, createOptionResults } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import { Channel, Embed, Interaction } from 'discordeno/transformers';
import {
	AllowedMentions,
	BigString,
	DiscordChannel,
	FileContent,
	InteractionTypes,
	MessageComponents,
	WithReason,
} from 'discordeno/types';
import { AeonaBot } from '../../extras/index.js';
import Captcha from '@haileybot/captcha-generator';
import reactionSchema from '../../database/models/reactionRoles.js';
import verify from '../../database/models/verify.js';

import claim from '../../commands/tickets/claim.js';
import close from '../../commands/tickets/close.js';
import openticket from '../../commands/tickets/createticket.js';
import deleteTicket from '../../commands/tickets/deleteticket.js';
import notice from '../../commands/tickets/notice.js';
import transcript from '../../commands/tickets/transcript.js';

import { Blob } from 'buffer';

function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	//@ts-ignore
	return new Blob([ab], { type: 'image/jpeg' });
}
export default async (client: AeonaBot, interaction: Interaction) => {
	// Commands
	// Verify system
	if (interaction.type == InteractionTypes.MessageComponent && interaction.data?.customId == 'verify') {
		const data = await verify.findOne({
			Guild: interaction.guildId,
			Channel: interaction.channelId,
		});
		if (data) {
			const captcha = new Captcha();

			// eslint-disable-next-line no-inner-declarations
			function verifyUser(msg: Message) {
				client.amethystUtils.awaitMessage(interaction.user.id, interaction.channelId!, {}).then((response) => {
					if (response.content.toUpperCase() === captcha.value.toUpperCase()) {
						client.helpers.deleteMessage(interaction.channelId!, response.id);

						client.helpers.deleteMessage(interaction.channelId!, msg.id!);

						client.extras
							.embed(
								{
									title: 'You have been successfully verified!',
									type: '',
								},
								{
									id: interaction.user.id,
								},
							)
							.catch((error) => console.error(error));

						client.helpers
							.addRole(interaction.guildId!, interaction.user.id, data?.Role!)
							.catch((error) => console.error(error));
					} else {
						client.helpers.deleteMessage(interaction.channelId!, response.id);
						client.helpers.deleteMessage(interaction.channelId!, msg.id);

						client.extras
							.errNormal(
								{
									error: "You have answered the captcha incorrectly! Don't worry you can try again",
									type: 'reply',
								},
								{
									id: interaction.channelId!,
								},
							)
							.then((msgError) => {
								setTimeout(() => {
									client.helpers.deleteMessage(interaction.channelId!, msg.id);
								}, 20000);
							});
					}
				});
			}
			client.helpers
				.sendMessage(interaction.channelId!, {
					file: [
						{
							blob: dataURItoBlob(captcha.dataURL),
							name: 'captcha.jpeg',
						},
					],
				})
				.then(verifyUser);
		} else {
			client.extras.errNormal(
				{
					error: 'Verify is disabled in this server! Or you are using the wrong channel!',
					type: 'ephemeral',
				},
				interaction,
			);
		}
	}

	// Reaction roles button
	if (interaction.type == InteractionTypes.MessageComponent) {
		const buttonID = interaction.data?.customId?.split('-');
		if (!buttonID) return;
		if (buttonID[0] == 'reaction_button') {
			reactionSchema.findOne(
				{ Message: interaction.message?.id },
				async (err: any, data: { Roles: { [x: string]: [any] } }) => {
					if (!data) return;

					const [roleid] = data.Roles[buttonID[1]];

					if (interaction.member?.roles.includes(roleid)) {
						await client.helpers.removeRole(interaction.guildId!, interaction.user?.id!, roleid);
						await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
							type: 4,
							data: { content: `<@&${roleid}> was removed!`, flags: 1 << 6 },
						});
					} else {
						await client.helpers.addRole(interaction.guildId!, interaction.user?.id!, roleid);
						await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
							type: 4,
							data: { content: `<@&${roleid}> was added!`, flags: 1 << 6 },
						});
					}
				},
			);
		}
	}

	// Reaction roles select
	if (interaction.type == InteractionTypes.MessageComponent) {
		if (interaction.data?.customId == 'reaction_select') {
			reactionSchema.findOne(
				{ Message: interaction.message?.id },
				async (err: any, data: { Roles: { [x: string]: [any] } }) => {
					if (!data) return;

					let roles = '';
					if (!interaction.data?.values) return;
					for (let i = 0; i < interaction.data?.values.length; i++) {
						const [roleid] = data.Roles[interaction.data?.values[i]];

						roles += `<@&${roleid}> `;

						if (interaction.member?.roles.includes(roleid)) {
							client.helpers.removeRole(interaction.guildId!, interaction.user?.id!, roleid);
						} else {
							client.helpers.addRole(interaction.guildId!, interaction.user?.id!, roleid);
						}

						if (i + 1 === interaction.data.values.length) {
							await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
								type: 4,
								data: { content: `I have updated the following roles for you: ${roles}`, flags: 1 << 6 },
							});
						}
					}
				},
			);
		} else if (interaction.data?.customId?.startsWith('help_select')) {
			const c = client.category.get(interaction.data?.values![0]);
			if (!c) return;
			const fields: Field[] = [];
			if (c.uniqueCommands) {
				for (let i = 0; i < c.commands.size; i++) {
					const command = c.commands.at(i)!;
					fields.push({
						name: '➯ ' + command.description,
						value: `\`${process.env.PREFIX!}${command.name}\``,
					});
				}
			} else {
				for (let i = 0; i < c.commands.size; i++) {
					const command = c.commands.at(i)!;
					fields.push({
						name: '➯ ' + command.description,
						value: `\`${process.env.PREFIX!}${c.name} ${command.name}\``,
					});
				}
			}
			const embed = new AmethystEmbed()
				.setColor(client.extras.config.colors.normal)
				.setTitle(`${client.extras.capitalizeFirstLetter(c.name)}'s Commands`)
				.setDescription(`*${c.description.trim()}* \n Total of ${c.commands.size} commands. `);
			for (let i = 0; i < fields.length; i++) {
				embed.addField(fields[i].name, fields[i].value, fields[i].inline);
			}
			await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
				type: 4,
				data: {
					embeds: [embed],
					flags: 1 << 6,
				},
			});
		} else if (interaction.data?.customId?.startsWith('share-imagine')) {
			if (
				interaction.data?.values![0] == 'share-discord' &&
				interaction.data?.customId?.split('_')[1] == interaction.user.id + ''
			) {
				const channel = await createForumThread(client, '1042413922138980352', {
					name:
						interaction.message?.content.split('\n')[0].split(':**')[1] +
						' by ' +
						interaction.user.username +
						'(' +
						interaction.member?.id +
						')',
					autoArchiveDuration: 60,
					content: interaction.message?.attachments[0].proxyUrl,
				});
				client.helpers.sendMessage(channel.id, {
					content: interaction.message?.content,
				});
				await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
					type: 4,
					data: {
						content:
							'I have successfully posted your art in my support server. \n To see it join discord.gg/qURxRRHPwa and see <#1045332279943233667>',
						flags: 1 << 6,
					},
				});

				await client.helpers.editMessage(interaction.channelId!, interaction.message?.id!, {
					components: [],
				});
			}
		}
	}

	// Tickets
	if (interaction.data?.customId == 'openticket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);

		openticket.execute!(client, ctx);
	}

	if (interaction.data?.customId == 'closeticket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);

		close.execute!(client, ctx);
	}

	if (interaction.data?.customId == 'claimTicket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);
		claim.execute!(client, ctx);
	}

	if (interaction.data?.customId == 'transcriptTicket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);

		transcript.execute!(client, ctx);
	}

	if (interaction.data?.customId == 'deleteTicket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);
		deleteTicket.execute!(client, ctx);
	}

	if (interaction.data?.customId == 'noticeTicket') {
		const ctx = await createContext(
			{
				interaction: {
					...interaction,
					data: interaction.data?.options?.[0],
				},
			},
			createOptionResults(client, [], {
				interaction: interaction,
			}),
			client,
		);
		notice.execute!(client, ctx);
	}
};
type Field = {
	name: string;
	value: string;
	inline?: boolean;
};
export async function createForumThread(
	bot: AeonaBot,
	channelId: BigString,
	options: CreateForumPostWithMessage,
): Promise<Channel> {
	const result = await bot.rest.runMethod<DiscordChannel>(
		bot.rest,
		'POST',
		bot.constants.routes.FORUM_START(channelId),
		{
			name: options.name,
			auto_archive_duration: options.autoArchiveDuration,
			rate_limit_per_user: options.rateLimitPerUser,
			reason: options.reason,
			message: {
				content: options.content,
				embeds: options.embeds?.map((embed) => bot.transformers.reverse.embed(bot, embed)),
				allowed_mentions: options.allowedMentions
					? {
							parse: options.allowedMentions?.parse,
							roles: options.allowedMentions?.roles?.map((id) => id.toString()),
							users: options.allowedMentions?.users?.map((id) => id.toString()),
							replied_user: options.allowedMentions?.repliedUser,
					  }
					: undefined,
				file: options.file,
				components: options.components?.map((component) => bot.transformers.reverse.component(bot, component)),
			},
		},
	);

	return bot.transformers.channel(bot, { channel: result, guildId: bot.transformers.snowflake(result.guild_id!) });
}

export interface CreateForumPostWithMessage extends WithReason {
	/** 1-100 character thread name */
	name: string;
	/** Duration in minutes to automatically archive the thread after recent activity */
	autoArchiveDuration: 60 | 1440 | 4320 | 10080;
	/** Amount of seconds a user has to wait before sending another message (0-21600) */
	rateLimitPerUser?: number | null;
	/** The message contents (up to 2000 characters) */
	content?: string;
	/** Embedded `rich` content (up to 6000 characters) */
	embeds?: Embed[];
	/** Allowed mentions for the message */
	allowedMentions?: AllowedMentions;
	/** The contents of the file being sent */
	file?: FileContent | FileContent[];
	/** The components you would like to have sent in this message */
	components?: MessageComponents;
}
