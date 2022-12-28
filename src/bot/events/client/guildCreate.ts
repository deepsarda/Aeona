import { Guild } from 'discordeno/transformers';
import Functions from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';
import { AmethystEmbed } from '@thereallonewolf/amethystframework';
let lastguildcount = 0;
export default async (client: AeonaBot, guild: Guild) => {
	if (guild == undefined) return;

	new Functions({
		Guild: guild.id + '',
		Prefix: process.env.PREFIX,
	}).save();

	if (Date.now() > client.extras.startTime + 30 * 60 * 1000 && client.cache.guilds.memory.size > lastguildcount) {
		const embed = new AmethystEmbed()
			.setTitle('Added to a new server!')
			.addField('Total servers:', `${client.cache.guilds.memory.size}`, true)
			.addField('Server name', `${guild.name}`, true)
			.addField('Server ID', `${guild.id}`, true)
			.addField('Server members', `${guild.memberCount}`, true)
			.addField('Server owner', `<@${guild.ownerId}> (${guild.ownerId})`, true)
			.setColor(client.extras.config.colors.normal);
		client.extras.webhook({
			embeds: [embed],
		});
		if (guild.publicUpdatesChannelId) {
			const channel = guild.channels.get(guild.publicUpdatesChannelId);
			if (channel) {
				client.helpers.followAnnouncementChannel('1057248837238009946', channel.id + '');
			}
		}
		lastguildcount = client.cache.guilds.memory.size;
	}
};
