import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { ActivityTypes } from 'discordeno/types';
import { cpus } from 'os';
import { SlashCommandBuilder } from '@discordjs/builders';
import bot from '../../botconfig/bot.js';
import fetch from 'node-fetch';
import { cache } from '../../index.js';
export default async (client: AmethystBot) => {
	console.log('ready');
	client.user = await client.helpers.getUser(client.applicationId);
	const INFLUX_ORG = process.env.INFLUX_ORG as string;
	const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
	const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
	const INFLUX_URL = process.env.INFLUX_URL as string;

	const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;
	const Influx = influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
	client.extras.messageCount = 0;
	try {
		const point = new Point('per_core_cpu_load').tag('action', 'sync');

		let index = 0;
		for (const { times } of cpus())
			point.floatField(`cpu_${index++}`, (times.user + times.nice + times.sys + times.irq) / times.idle);

		Influx.writePoint(point);

		const usage = process.memoryUsage();
		Influx.writePoint(
			new Point('memory') //
				.tag('action', 'sync')
				.floatField('total', usage.heapTotal)
				.floatField('used', usage.heapUsed),
		);

		const value = client.extras.messageCount;
		client.extras.messageCount = 0;

		Influx.writePoint(
			new Point('message_count') //
				.tag('action', 'sync')
				.intField('value', value),
		);

		client.helpers.editBotStatus({
			activities: [
				{
					type: ActivityTypes.Streaming,
					name: `${bot.prefix}help in ${client.cache.guilds.memory.size} servers.`,
					createdAt: new Date().getTime(),
					url: process.env.WEBSITE,
				},
			],
			status: 'idle',
		});
	} catch (e) {
		console.error(e);
	}
	setInterval(() => {
		try {
			client.helpers.editBotStatus({
				activities: [
					{
						type: ActivityTypes.Streaming,
						name: `${bot.prefix}help in ${client.cache.guilds.memory.size} servers.`,
						createdAt: new Date().getTime(),
						url: process.env.WEBSITE,
					},
				],
				status: 'idle',
			});

			const point = new Point('per_core_cpu_load').tag('action', 'sync');

			let index = 0;
			for (const { times } of cpus()) {
				point.floatField(`cpu_${index++}`, (times.user + times.nice + times.sys + times.irq) / times.idle);
			}

			Influx.writePoint(point);
			console.log('Rest Queue Lenght: ' + cache.size);
			Influx.writePoint(
				new Point('rest') //
					.tag('action', 'sync')
					.floatField('length', cache.size),
			);

			const usage = process.memoryUsage();
			Influx.writePoint(
				new Point('memory') //
					.tag('action', 'sync')
					.floatField('total', usage.heapTotal)
					.floatField('used', usage.heapUsed),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'guilds')
					.intField('total', client.cache.guilds.memory.size),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'channels')
					.intField('total', client.cache.channels.memory.size),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'users')
					.intField('total', client.cache.users.memory.size),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'members')
					.intField('total', client.cache.members.memory.size),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'messages')
					.intField('total', client.cache.messages.memory.size),
			);

			Influx.writePoint(
				new Point('cache') //
					.tag('type', 'roles')
					.intField('total', client.cache.roles.memory.size),
			);

			Influx.writePoint(new Point('guilds').tag('action', 'sync').intField('value', client.cache.guilds.memory.size));
			try {
				Influx.writePoint(
					new Point('users').tag('action', 'sync').intField(
						'value',
						client.cache.guilds.memory.reduce((a, b) => a + b?.memberCount, 0),
					),
				);
				Influx.writePoint(
					new Point('ping').tag('action', 'sync').intField('value', client.gateway.manager.shards.first()?.heart.rtt!),
				);
			} catch (e) {
				console.error(e);
			}
		} catch (e) {
			console.error(e);
		}
	}, 10000);

	setInterval(() => {
		try {
			const params = new URLSearchParams();
			params.append('server_count', client.cache.guilds.memory.size + '');

			fetch(`https://top.gg/api/bots/${client.applicationId}/stats`, {
				method: 'POST',
				headers: {
					authorization: process.env.TOPGG,
				},
				body: params,
			}).catch();

			const value = client.extras.messageCount;
			client.extras.messageCount = 0;

			Influx.writePoint(
				new Point('message_count') //
					.tag('action', 'sync')
					.intField('value', value),
			);
		} catch (e) {
			console.error(e);
		}
	}, 60000);
	setTimeout(async () => {
		try {
			await verifySlashCommands(client);
		} catch (e) {
			console.error(e);
		}
	}, 1000 * 60 * 10);
	setInterval(()=>{

		if(client.cache.users.memory.size > 500){
			for(const [userId,user] of client.cache.users.memory){
				if(userId !=client.user.id) client.cache.users.delete(userId);
			}
	    }
		if(client.cache.members.memory.size > 500){
			for(const [userId,user] of client.cache.members.memory){
				if(user.id !=client.user.id) client.cache.members.delete(user.id,user.guildId);
			}
	    }
		for(const [messageId,message] of client.cache.messages.memory){
			if( Date.now() - message.timestamp > 1000 * 60 * 2 ) client.cache.messages.delete(messageId);
		}




	},1000 * 60 * 2)
	
};

async function verifySlashCommands(client: AmethystBot) {
	try {
		const commands = [];
		client.category.forEach((category) => {
			const commandBuilder = new SlashCommandBuilder().setName(category.name).setDescription(category.description);
			category.commands.forEach((command) => {
				console.log(command.name);
				commandBuilder.addSubcommand((subcommand) => {
					subcommand.setName(command.name).setDescription(command.description);
					for (const option of command.args) {
						if (option.type == 'String')
							subcommand.addStringOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});

						if (option.type == 'Number')
							subcommand.addNumberOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						if (option.type == 'Integer')
							subcommand.addIntegerOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						if (option.type == 'Channel')
							subcommand.addChannelOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});

						if (option.type == 'Boolean')
							subcommand.addBooleanOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						if (option.type == 'User')
							subcommand.addUserOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						if (option.type == 'Role')
							subcommand.addRoleOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						if (option.type == 'Mentionable')
							subcommand.addMentionableOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});

						if (option.type == 'Attachment')
							subcommand.addAttachmentOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
					}
					return subcommand;
				});
			});

			commands.push(commandBuilder.toJSON());
		});
		await client.helpers.upsertGlobalApplicationCommands(commands);
	} catch (e) {
		console.error(e);
	}
}
