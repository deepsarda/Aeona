import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { ActivityTypes } from 'discordeno/types';
import { cpus } from 'os';

import bot from '../../botconfig/bot.js';
import fetch from 'node-fetch';

export default async (client: AmethystBot) => {
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
			const params = new URLSearchParams();
			params.append('server_count', client.cache.guilds.memory.size + '');

			fetch(`https://top.gg/api/bots/${client.user.id}/stats`, {
				method: 'POST',
				headers: {
					authorization: process.env.TOPGG,
				},
				body: params,
			}).catch();

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

			Influx.writePoint(new Point('guilds').tag('action', 'sync').intField('value', client.cache.guilds.memory.size));
			Influx.writePoint(
				new Point('users').tag('action', 'sync').intField(
					'value',
					client.cache.guilds.memory.reduce((a, b) => a + b?.memberCount, 0),
				),
			);
			console.log(client.gateway.manager.shards.first()!.heart.rtt!);
			Influx.writePoint(
				new Point('ping').tag('action', 'sync').intField('value', client.gateway.manager.shards.first()!.heart.rtt!),
			);
		} catch (e) {
			console.error(e);
		}
	}, 60000);
	await client.amethystUtils.updateSlashCommands();
};
