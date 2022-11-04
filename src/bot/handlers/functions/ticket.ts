import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';
import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { createTranscript } from '../../transcripts/index.js';

export default async (client: AmethystBot) => {
	client.extras.getTicketData = async function (interaction: Context) {
		const ticketData = await ticketSchema.findOne({
			Guild: interaction.guildId,
		});
		if (!ticketData) return false;

		return ticketData;
	};

	client.extras.getChannelTicket = async function (interaction: Context) {
		const ticketChannelData = await ticketChannels.findOne({
			Guild: interaction.guildId,
			channelID: interaction.channel?.id,
		});
		return ticketChannelData;
	};

	client.extras.isTicket = async function (interaction: Context) {
		const ticketChannelData = await ticketChannels.findOne({
			Guild: interaction.guild!.id,
			channelID: interaction.channel!.id,
		});

		if (ticketChannelData) {
			return true;
		} else {
			return false;
		}
	};

	// Transcript

	client.extras.transcript = async function (client: AmethystBot, channel: Channel) {
		const file = await createTranscript(client, channel);
		client.helpers.sendMessage(channel.id, {
			file: [file],
		});
	};
};
