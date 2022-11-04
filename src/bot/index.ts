import dotenv from 'dotenv';
dotenv.config();

import { Bot, DiscordGatewayPayload } from 'discordeno';
// ReferenceError: publishMessage is not defined
// import Embeds from "discordeno/embeds";
import amqplib from 'amqplib';
import express from 'express';
import { EVENT_HANDLER_URL } from '../configs.js';
import { bot } from './bot.js';

const EVENT_HANDLER_AUTHORIZATION = process.env.EVENT_HANDLER_AUTHORIZATION as string;
const EVENT_HANDLER_PORT = process.env.EVENT_HANDLER_PORT as string;

// Handle events from the gateway
const handleEvent = async (message: DiscordGatewayPayload, shardId: number) => {
	// EMITS RAW EVENT
	bot.events.raw(bot, message, shardId);

	if (message.t && message.t !== 'RESUMED') {
		// When a guild or something isnt in cache this will fetch it before doing anything else
		if (!['READY', 'GUILD_LOADED_DD'].includes(message.t)) {
			await bot.events.dispatchRequirements(bot, message, shardId);
		}

		bot.handlers[message.t]?.(bot as unknown as Bot, message, shardId);
	}
};

const app = express();

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());

app.all('/', async (req: any, res: any) => {
	try {
		if (!EVENT_HANDLER_AUTHORIZATION || EVENT_HANDLER_AUTHORIZATION !== req.headers.authorization) {
			return res.status(401).json({ error: 'Invalid authorization key.' });
		}

		const json = req.body as {
			message: DiscordGatewayPayload;
			shardId: number;
		};

		await handleEvent(json.message, json.shardId);

		res.status(200).json({ success: true });
	} catch (error: any) {
		console.error(error);
		res.status(error.code).json(error);
	}
});

app.listen(EVENT_HANDLER_PORT, () => {
	console.log(`Bot is listening at ${EVENT_HANDLER_URL};`);
});

const connectRabbitmq = async () => {
	let connection: amqplib.Connection | undefined = undefined;

	try {
		connection = await amqplib.connect(
			`amqp://${process.env.MESSAGEQUEUE_USERNAME}:${process.env.MESSAGEQUEUE_PASSWORD}@${process.env.MESSAGEQUEUE_URL}`,
		);
	} catch (error) {
		console.error(error);
		setTimeout(connectRabbitmq, 1000);
	}

	if (!connection) return;
	connection.on('error', (err: any) => {
		console.error(err);
		setTimeout(connectRabbitmq, 1000);
	});

	connection.on('close', () => {
		setTimeout(connectRabbitmq, 1000);
	});

	try {
		const channel = await connection.createChannel();

		await channel.assertExchange('gatewayMessage', 'x-message-deduplication', {
			durable: true,
			arguments: {
				'x-cache-size': 1000,
				'x-cache-ttl': 500,
			},
		});

		await channel.assertQueue('gatewayMessageQueue');
		await channel.bindQueue('gatewayMessageQueue', 'gatewayMessage', '');
		await channel.consume(
			'gatewayMessageQueue',
			async (msg: any) => {
				if (!msg) return;
				const json = JSON.parse(msg.content.toString()) as {
					message: DiscordGatewayPayload;
					shardId: number;
				};

				await handleEvent(json.message, json.shardId);

				await channel.ack(msg);
			},
			{
				noAck: false,
			},
		);
	} catch (error) {
		console.error(error);
	}
};

if (process.env.MESSAGEQUEUE_ENABLE === 'true') {
	connectRabbitmq();
}
