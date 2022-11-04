import { AmethystBot, Context, createContext, createOptionResults } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import { Interaction } from 'discordeno/transformers';
import { InteractionTypes } from 'discordeno/types';

import Captcha from '@haileybot/captcha-generator';
import reactionSchema from '../../database/models/reactionRoles.js';
import verify from '../../database/models/verify.js';
/*
import claim from "../../futurecommands/todo/tickets/claim";
import close from "../../futurecommands/todo/tickets/close";
import openticket from "../../futurecommands/todo/tickets/create";
import deleteTicket from "../../futurecommands/todo/tickets/delete";
import notice from "../../futurecommands/todo/tickets/notice";
import transcript from "../../futurecommands/todo/tickets/transcript";
*/
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

			// eslint-disable-next-line no-inner-declarations
			function verifyUser(msg: Context) {
				client.amethystUtils.awaitMessage(interaction.user.id, interaction.channelId!, {}).then((response) => {
					if (response.content === captcha.value) {
						client.helpers.deleteMessage(interaction.channelId!, response.id);

						client.helpers.deleteMessage(interaction.channelId!, msg.message?.id!);

						client.extras
							.succNormal(
								{
									text: 'You have been successfully verified!',
								},
								interaction.user,
							)
							.catch();

						client.helpers.addRole(msg.guildId!, msg.user?.id!, data.Role);
					} else {
						client.helpers.deleteMessage(interaction.channelId!, response.id);
						client.helpers.deleteMessage(interaction.channelId!, msg.message?.id!);

						client.extras
							.errNormal(
								{
									error: 'You have answered the captcha incorrectly!',
									type: 'editreply',
								},
								ctx,
							)
							.then((msgError: Message) => {
								setTimeout(() => {
									client.helpers.deleteMessage(interaction.channelId!, msgError.id);
								}, 2000);
							});
					}
				});
			}

			ctx
				.reply({
					files: [
						{
							blob: captcha.JPEGStream,
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
		const buttonID = interaction.data?.customId!.split('-');
		if (!buttonID) return;
		if (buttonID[0] == 'reaction_button') {
			reactionSchema.findOne(
				{ Message: interaction.message?.id },
				async (err: any, data: { Roles: { [x: string]: [any] } }) => {
					if (!data) return;
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

					const [roleid] = data.Roles[buttonID[1]];

					if (interaction.member?.roles.includes(roleid)) {
						client.helpers.removeRole(ctx.guildId!, ctx.user?.id!, roleid);

						ctx.reply({
							content: `<@&${roleid}> was removed!`,
							ephemeral: true,
						});
					} else {
						client.helpers.addRole(ctx.guildId!, ctx.user?.id!, roleid);

						ctx.reply({
							content: `<@&${roleid}> was added!`,
							ephemeral: true,
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
							ctx.reply({
								content: `I have updated the following roles for you: ${roles}`,
								ephemeral: true,
							});
						}
					}
				},
			);
		}
	}
	/*
    // Tickets
    if (interaction.data?.customId == "openticket") {
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
        client
      );

      openticket.execute(client, ctx);
    }

    if (interaction.data?.customId == "closeticket") {
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
        client
      );

      close.execute(client, ctx);
    }

    if (interaction.data?.customId == "claimTicket") {
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
        client
      );
      claim.execute(client, ctx);
    }

    if (interaction.data?.customId == "transcriptTicket") {
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
        client
      );

      transcript.execute(client, ctx);
    }

    if (interaction.data?.customId == "deleteTicket") {
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
        client
      );
      deleteTicket.execute(client, ctx);
    }

    if (interaction.data?.customId == "noticeTicket") {
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
        client
      );
      notice.execute(client, ctx);
    }
    */
};
