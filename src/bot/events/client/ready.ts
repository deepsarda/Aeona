import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { ActivityTypes } from 'discordeno/types';
import { cpus } from 'os';
import { SlashCommandBuilder } from '@discordjs/builders';
import bot from '../../botconfig/bot.js';
import bumpreminder from '../../database/models/bumpreminder.js';
export default async (client: AmethystBot) => {
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
					name: `${bot.prefix}help `,
					createdAt: new Date().getTime(),
					url: process.env.WEBSITE,
				},
			],
			status: 'idle',
		});
	} catch (e) {
		console.error(e);
	}
	setInterval(async () => {
		try {
			client.helpers.editBotStatus({
				activities: [
					{
						type: ActivityTypes.Streaming,
						name: `${bot.prefix}help in `,
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
		} catch (e) {
			console.error(e);
		}
	}, 10000);
	setInterval(async () => {
		try {
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
	}, 1000 * 60 * 2);
	setInterval(() => {
		if (client.cache.members.memory.size > 20000) {
			for (const [userId, user] of client.cache.members.memory) {
				if (user.id != client.user.id) client.cache.members.delete(user.id, user.guildId);
			}
		}
		if (client.cache.messages.memory.size > 500) {
			for (const [messageId, message] of client.cache.messages.memory) {
				client.cache.messages.delete(messageId);
			}
		}
		for (const [messageId, message] of client.cache.messages.memory) {
			if (!message.timestamp) client.cache.messages.delete(messageId);
			if (Date.now() - message.timestamp > 1000 * 60 * 2) client.cache.messages.delete(messageId);
		}
	}, 1000 * 60 * 2);

	setInterval(async () => {
		client.emit('updateClock', client);
	}, 1000 * 60);

	setInterval(async () => {
		const reminders = await bumpreminder.find();
		for (const reminder of reminders) {
			try {
				if (Date.now() > reminder.LastBump + 7200000) {
					reminder.LastBump = Date.now();
					reminder.save();

					const channel = await client.helpers.getChannel(reminder.Channel);
					client.extras.embed(
						{
							content: `<&${reminder.Role}>`,
							title: `Time to bump!`,
							desc: reminder.Message ?? `Use /bump to bump this server!`,
							type: 'reply',
						},
						channel,
					);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}, 1000 * 60);
};

async function verifySlashCommands(client: AmethystBot) {
	try {
		const commands = [];
		client.category.forEach((category) => {
			const commandBuilder = new SlashCommandBuilder().setName(category.name).setDescription(category.description);
			category.commands.forEach((command) => {
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
						else if (option.type == 'Number')
							subcommand.addNumberOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Integer')
							subcommand.addIntegerOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Channel')
							subcommand.addChannelOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Boolean')
							subcommand.addBooleanOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'User')
							subcommand.addUserOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Role')
							subcommand.addRoleOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Mentionable')
							subcommand.addMentionableOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else if (option.type == 'Attachment')
							subcommand.addAttachmentOption((op) => {
								op.setName(option.name).setDescription(option.description);
								if (option.required) op.setRequired(true);
								else op.setRequired(false);
								return op;
							});
						else console.log(command.name);
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

type UserTopgg = {
	username: string;
	id: string;
	avatar: string;
};
