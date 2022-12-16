import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { AeonaBot } from '../../extras/index.js';
import { ActivityTypes, DiscordReady } from 'discordeno/types';
import { cpus } from 'os';
import bot from '../../botconfig/bot.js';
import bumpreminder from '../../database/models/bumpreminder.js';
import { User } from 'discordeno/transformers';

export default async (
	client: AeonaBot,
	payload: {
		shardId: number;
		v: number;
		user: User;
		guilds: bigint[];
		sessionId: string;
		shard?: number[] | undefined;
		applicationId: bigint;
	},
	rawPayload: DiscordReady,
) => {
	console.log('READY!');

	if (!client.extras.ready) {
		console.log('Running loops');
		client.user = payload.user;
		const INFLUX_ORG = process.env.INFLUX_ORG as string;
		const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
		const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
		const INFLUX_URL = process.env.INFLUX_URL as string;
		const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;
		const Influx = influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET)!;
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
						type: ActivityTypes.Custom,
						name: `:smiley: Using ${bot.prefix}help.`,
						createdAt: new Date().getTime(),
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
							type: ActivityTypes.Custom,
							name: `:smiley: ${bot.prefix}help.`,
							createdAt: new Date().getTime(),
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

		setInterval(() => {
			if (client.cache.members.memory.size > 5000) {
				for (const [userId, user] of client.cache.members.memory) {
					if (user.id != client.user.id) client.cache.members.delete(user.id, user.guildId);
				}
			}
			if (client.cache.users.memory.size > 500) {
				for (const [userId, user] of client.cache.users.memory) {
					if (user.id != client.user.id) client.cache.users.delete(user.id);
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

		setInterval(() => {
			console.log('Updating clock');
			client.emit('updateClock', client);
		}, 1000 * 60);

		setInterval(async () => {
			const reminders = await bumpreminder.find();
			for (const reminder of reminders) {
				try {
					if (!reminder.LastBump || !reminder.Channel) return;
					if (Date.now() > reminder.LastBump + 7200000) {
						reminder.LastBump = Date.now();
						reminder.save();

						const channel = await client.helpers.getChannel(reminder.Channel);
						client.extras.embed(
							{
								content: `<@&${reminder.Role}>`,
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
		}, 1000 * 60 * 10);
		client.extras.ready = true;
	}
};
