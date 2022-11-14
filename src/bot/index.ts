import dotenv from 'dotenv';
dotenv.config();

import { DiscordGatewayPayload } from 'discordeno';
import express from 'express';
import { EVENT_HANDLER_URL } from '../configs.js';
import { bot } from './bot.js';
import colors from 'colors';

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

		bot.handlers[message.t]?.(bot, message, shardId);
	}
};

const app = express();

app.use(
	express.urlencoded({
		extended: true,
		limit: '200mb',
	}),
);

app.use(
	express.json({
		limit: '200mb',
	}),
);

app.all('/', async (req, res) => {
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
	console.log(colors.green(`Bot is listening at ${EVENT_HANDLER_URL};`));
});
