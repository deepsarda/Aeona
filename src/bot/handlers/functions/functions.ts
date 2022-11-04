import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';

import Functions from '../../database/models/functions.js';

export default async (client: AmethystBot) => {
	client.extras.generateEmbed = async function (start: any, end: number, lb: any[], title: any, interaction: Context) {
		const current = lb.slice(start, end + 10);
		const result = current.join('\n');

		const embed = client.extras.templateEmbed().setTitle(`${title}`).setDescription(`${result.toString()}`);

		const functiondata = await Functions.findOne({
			Guild: interaction.guildId,
		});

		if (functiondata && functiondata.Color) {
			embed.setColor(functiondata.Color);
		}

		return embed;
	};

	client.extras.createLeaderboard = async function (
		title: any,
		lb: any[],
		interaction: Context | Message,
		currentIndex?: number,
	) {
		if (!currentIndex) currentIndex = 0;
		let btn1 = true;
		let btn2 = true;

		if (currentIndex !== 0) btn1 = false;
		if (currentIndex + 10 < lb.length) btn2 = false;
		const comp = new Components()
			.addButton('Previous', 'Secondary', 'back_button', {
				emoji: '⬅️',
				disabled: btn1,
			})
			.addButton('Next', 'Secondary', 'forward_button', {
				emoji: '⬅️',
				disabled: btn2,
			});

		let msg;
		if (interaction instanceof Context) {
			msg = await client.helpers.editMessage(
				interaction.channel!.id,
				// eslint-disable-next-line
				interaction.message?.id!,
				{
					embeds: [await client.extras.generateEmbed(currentIndex, currentIndex, lb, title, interaction)],
					components: comp,
				},
			);
		} else {
			msg = await client.helpers.editMessage(interaction.channelId, interaction.id, {
				embeds: [await client.extras.generateEmbed(currentIndex, currentIndex, lb, title, interaction)],
				components: comp,
			});
		}

		if (lb.length <= 10) return;
		client.amethystUtils
			// eslint-disable-next-line
			.awaitComponent(msg.id!, {
				timeout: 60_000,
				type: 'Button',
			})
			.then(async (btn) => {
				if (!currentIndex) return;

				btn.data?.customId === 'back_button' ? (currentIndex -= 10) : (currentIndex += 10);
				client.extras.createLeaderboard(title, lb, btn.message, currentIndex);
			});
	};
};
