import { AmethystBot, AmethystEmbed, createContext, createOptionResults } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import { Interaction } from 'discordeno/transformers';
import { InteractionTypes } from 'discordeno/types';

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
export default async (client: AmethystBot, interaction: Interaction) => {
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
					if (response.content.toUpperCase() === captcha.value) {
						client.helpers.deleteMessage(interaction.channelId!, response.id);

						client.helpers.deleteMessage(interaction.channelId!, msg.id!);

						client.extras
							.succNormal(
								{
									text: 'You have been successfully verified!',
								},
								response.member,
							)
							.catch((error) => console.error(error));

						client.helpers.addRole(msg.guildId, response.authorId, data.Role).catch((error) => console.error(error));
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
									id: interaction.channelId,
								},
							)
							.then((msgError: Message) => {
								setTimeout(() => {
									client.helpers.deleteMessage(interaction.channelId!, msgError.id);
								}, 20000);
							});
					}
				});
			}
			client.helpers
				.sendMessage(interaction.channelId, {
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
						await client.helpers.removeRole(interaction.guildId, interaction.user?.id!, roleid);
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
		} else if (interaction.data?.customId.startsWith('help_select')) {
			const c = client.category.get(interaction.data?.values[0]);
			const fields: Field[] = [];
			if (c.uniqueCommands) {
				fields.push({
					name: '➯ ' + c.description,
					value: c.commands.map((c) => `\`${process.env.PREFIX!}${c.name}\``).join(' '),
				});
			} else {
				let value = `\`${process.env.PREFIX!}${c.name} <`;
				c.commands.forEach((command) => {
					if (value.endsWith('<')) value += `${command.name}`;
					else value += `/${command.name}`;
				});
				value += '>`';

				fields.push({
					name: '➯ ' + c.description,
					value: value,
				});
			}
			const embed = new AmethystEmbed()
				.setColor(client.extras.config.colors.normal)
				.setTitle(`${client.extras.capitalizeFirstLetter(c.name)}'s Commands`)
				.setDescription(`*${c.description.trim()}* \n Total of ${c.commands.size} commands`)
				.addBlankField()
				.addField(fields[0].name, fields[0].value, fields[0].inline);
			await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
				type: 4,
				data: {
					embeds: [embed],
					flags: 1 << 6,
				},
			});
		} else if (interaction.data?.customId.startsWith('share-imagine')) {
			if (interaction.data?.values[0] == 'share-discord') {
				client.helpers.createForumThread('1045332279943233667', {
					name: 'Art generated by ' + interaction.user.username + '(' + interaction.user.id + ')',
					autoArchiveDuration: 60,
					content: interaction.message.attachments[0].proxyUrl,
				});
				await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
					type: 4,
					data: {
						content:
							'I have successfully posted your art in my support server. \n To see it join discord.gg/qURxRRHPwa and see <#1045332279943233667>',
						flags: 1 << 6,
					},
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

		openticket.execute(client, ctx);
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

		close.execute(client, ctx);
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
		claim.execute(client, ctx);
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

		transcript.execute(client, ctx);
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
		deleteTicket.execute(client, ctx);
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
		notice.execute(client, ctx);
	}
};
type Field = {
	name: string;
	value: string;
	inline?: boolean;
};
