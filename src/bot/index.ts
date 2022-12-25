import dotenv from 'dotenv';
dotenv.config();

import {
	DiscordGatewayPayload,
	DiscordGuild,
	DiscordReady,
	DiscordUnavailableGuild,
	GatewayEventNames,
} from 'discordeno';
import express from 'express';
import { EVENT_HANDLER_URL } from '../configs.js';
import { basebot } from './bot.js';
import colors from 'colors';

const EVENT_HANDLER_AUTHORIZATION = process.env.EVENT_HANDLER_AUTHORIZATION as string;
const EVENT_HANDLER_PORT = process.env.EVENT_HANDLER_PORT as string;
// Store guild ids, loading guild ids to change GUILD_CREATE event to GUILD_LOADED_DD if needed.
const guildIds: Set<bigint> = new Set();
const loadingGuildIds: Set<bigint> = new Set();
// Handle events from the gateway
const handleEvent = async (message: DiscordGatewayPayload, shardId: number) => {
	// EMITS RAW EVENT
	if (message.t === 'READY') {
		// Marks which guilds the bot in when initial loading in cache.
		(message.d as DiscordReady).guilds.forEach((g) => loadingGuildIds.add(BigInt(g.id)));
	}

	// If GUILD_CREATE event came from a shard loaded event, change event to GUILD_LOADED_DD.
	if (message.t === 'GUILD_CREATE') {
		const guild = message.d as DiscordGuild;
		const id = BigInt(guild.id);

		const existing = guildIds.has(id);
		if (existing) return;

		if (loadingGuildIds.has(id)) {
			(message.t as GatewayEventNames | 'GUILD_LOADED_DD') = 'GUILD_LOADED_DD';

			loadingGuildIds.delete(id);
		}

		guildIds.add(id);
	}

	// Delete guild id from cache so GUILD_CREATE from the same guild later works properly.
	if (message.t === 'GUILD_DELETE') {
		const guild = message.d as DiscordUnavailableGuild;

		guildIds.delete(BigInt(guild.id));
	}

	basebot.events.raw(basebot, message, shardId);

	if (message.t && message.t !== 'RESUMED') {
		// When a guild or something isnt in cache this will fetch it before doing anything else
		if (!['READY', 'GUILD_LOADED_DD'].includes(message.t)) {
			await basebot.events.dispatchRequirements(basebot, message, shardId);
		}

		basebot.handlers[message.t]?.(basebot, message, shardId);
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

		return res.status(200).json({ success: true });
	} catch (error: any) {
		console.error(error);
		return res.status(error.code).json(error);
	}
});

app.listen(EVENT_HANDLER_PORT, () => {
	console.log(colors.green(`Bot is listening at ${EVENT_HANDLER_URL};`));
});

process.on('unhandledRejection', (error: Error) => {
	console.error(error);
});

process.on('warning', (warn) => {
	console.warn(warn);
});
