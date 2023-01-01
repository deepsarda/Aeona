import colors from 'colors';
import { DiscordGuild, DiscordReady, DiscordUnavailableGuild } from 'discordeno';
import dotenv from 'dotenv';

import { basebot } from './bot.js';

dotenv.config();

// Store guild ids, loading guild ids to change GUILD_CREATE event to GUILD_LOADED_DD if needed.
const guildIds: Set<bigint> = new Set();
const loadingGuildIds: Set<bigint> = new Set();
console.log(colors.green('STARTING'));
basebot.handleDiscordPayload = async (shard, message) => {
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
			//@ts-ignore
			message.t = 'GUILD_LOADED_DD';
			loadingGuildIds.delete(id);
		}

		guildIds.add(id);
	}

	// Delete guild id from cache so GUILD_CREATE from the same guild later works properly.
	if (message.t === 'GUILD_DELETE') {
		const guild = message.d as DiscordUnavailableGuild;

		guildIds.delete(BigInt(guild.id));
	}

	basebot.events.raw(basebot, message, shard.id);

	if (message.t && message.t !== 'RESUMED') {
		// When a guild or something isnt in cache this will fetch it before doing anything else
		if (!['READY', 'GUILD_LOADED_DD'].includes(message.t)) {
			await basebot.events.dispatchRequirements(basebot, message, shard.id);
		}

		basebot.handlers[message.t]?.(basebot, message, shard.id);
	}
};

process.on('unhandledRejection', (error: Error) => {
	console.error(error);
});

process.on('warning', (warn) => {
	console.warn(warn);
});

