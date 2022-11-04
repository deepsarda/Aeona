import { getBotIdFromToken, Intents } from 'discordeno';
import dotenv from 'dotenv';
dotenv.config();

/** The bot id, derived from the bot token. */
export const BOT_ID = getBotIdFromToken(process.env.DISCORD_TOKEN as string);
export const EVENT_HANDLER_URL = `http://${process.env.EVENT_HANDLER_HOST}:${process.env.EVENT_HANDLER_PORT}`;
export const REST_URL = `http://${process.env.REST_HOST}:${process.env.REST_PORT}`;
export const GATEWAY_URL = `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`;

// Gateway Proxy Configurations
/** The gateway intents you would like to use. */
export const INTENTS: Intents =
	Intents.DirectMessageReactions |
	Intents.DirectMessageTyping |
	Intents.DirectMessages |
	Intents.Guilds |
	Intents.MessageContent |
	Intents.GuildMembers |
	Intents.GuildBans |
	Intents.GuildEmojis |
	Intents.GuildIntegrations |
	Intents.GuildWebhooks |
	Intents.GuildInvites |
	Intents.GuildVoiceStates |
	Intents.GuildMessages |
	Intents.GuildMessageReactions |
	Intents.GuildMessageTyping |
	Intents.DirectMessageTyping |
	Intents.GuildScheduledEvents;
