import { AmethystEmbed } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno/transformers';
import Functions from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
	if (guild == undefined) return;

	new Functions({
		Guild: guild.id + '',
		Prefix: process.env.PREFIX,
	}).save();

	/*
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
	*/
};
