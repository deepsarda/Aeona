import {
	CategoryOptions,
	createProxyCache,
	enableAmethystPlugin,
	AmethystError,
	ErrorEnums,
} from '@thereallonewolf/amethystframework';
import { createBot, createRestManager, startBot } from 'discordeno';
import dotenv from 'dotenv';
import { connect } from './database/connect.js';
import Functions from './database/models/functions.js';
import chatBotSchema from './database/models/chatbot-channel.js';
dotenv.config();
import fetch from 'node-fetch';
import fs from 'fs';
import { INTENTS, REST_URL } from '../configs.js';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string;
const REST_AUTHORIZATION = process.env.REST_AUTHORIZATION as string;
import { JsonDB, Config } from 'node-json-db';
import JSON from 'json-bigint';
import { additionalProps } from './extras/index.js';
import { AeonaBot } from './extras/index.js';

const db = new JsonDB(new Config('tmp/db', true, false, '/'));
export const basebot = createBot({
	token: DISCORD_TOKEN,
	intents: INTENTS,
});

const cachebot = createProxyCache(basebot, {
	cacheInMemory: {
		default: true,
		channels: false,
		members: false,
		roles: false,
	},
	cacheOutsideMemory: {
		default: false,
		members: true,
		messages: false,
	},
	fetchIfMissing: {
		channels: true,
		guilds: true,
		members: true,
		messages: true,
		users: true,
		roles: true,
	},
	getItem: async (table, id, guildid?) => {

		const item = (await db.getData(`${id}${guildid ? guildid : ''}`));
		if (!item) return;
		return JSON.parse(item);
	},

	removeItem: async (table, id, guildid?) => {
		return await db.delete(`${id}${guildid ? guildid : ''}`);
	},

	setItem: async (table, item) => {
		return await db.push(`${item.id}${item.guildid ? item.guildid : ''}`, JSON.stringify(item));
	},
});

const bot: AeonaBot = enableAmethystPlugin(cachebot, {
	owners: ['794921502230577182', '830231116660604951'],
	prefix: async (bot, message) => {
		const schema = await chatBotSchema.findOne({ Guild: message.guildId });
		if (schema) if (schema.Channel == message.channelId + '') return 'asdasdasdasdasdasdasdasdasdq3w12341234';

		let guild = await Functions.findOne({
			Guild: message.guildId,
		});
		if (!guild) guild = new Functions({ Guild: message.guildId });

		if (!guild.Prefix) {
			guild.Prefix = process.env.PREFIX!;
			guild.save();
		}
		if (message.mentionedUserIds.includes(bot.applicationId)) {
			return [guild.Prefix, 'aeona', '<@!' + bot.user?.id + '>', '<@' + bot.user?.id + '>', ''];
		}
		return [guild.Prefix, 'aeona', '<@!' + bot.user?.id + '>', '<@' + bot.user?.id + '>'];
	},
	botMentionAsPrefix: true,
	ignoreBots: true,
});

bot.extras = additionalProps(bot);
connect();

fs.readdirSync('./dist/bot/handlers/').forEach((dir) => {
	fs.readdirSync(`./dist/bot/handlers/${dir}`).forEach(async (handler) => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const a = await import(`./handlers/${dir}/${handler}`);

		a.default(bot);
	});
});

fs.readdirSync('./dist/bot/events/').forEach(async (dirs) => {
	const events = fs.readdirSync(`./dist/bot/events/${dirs}`).filter((files) => files.endsWith('.js'));

	for (const file of events) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const a = await import(`./events/${dirs}/${file}`);

		bot.on(file.split('.')[0]!, a.default);
	}
});

fs.readdirSync('./dist/bot/commands/').forEach(async (dirs) => {
	const events = fs.readdirSync(`./dist/bot/commands/${dirs}`).filter((files) => files.endsWith('.js'));

	for (const file of events) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const a = await import(`./commands/${dirs}/${file}`);

		bot.amethystUtils.createCommand(a.default);
	}
});

const categories: CategoryOptions[] = [
	{
		name: 'afk',
		description: 'Set/List your afk.',
		uniqueCommands: false,
		default: 'set',
	},
	{
		name: 'setup',
		description: 'Configure your server. (Must See)',
		uniqueCommands: false,
		default: 'chatbot',
	},
	{
		name: 'info',
		description: 'See various informations',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'automod',
		description: 'Configure the automod.',
		uniqueCommands: false,
		default: 'display',
	},
	{
		name: 'autosetup',
		description: 'Automatically setup certain commands.',
		uniqueCommands: false,
		default: 'log',
	},
	{
		name: 'fun',
		description: 'Have some fun.',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'game',
		description: 'Play some games.',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'levels',
		description: 'Configure the rank system',
		uniqueCommands: true,
		default: 'rank',
	},
	{
		name: 'bumpreminder',
		description: 'Setup bumpreminder for your server.',
		uniqueCommands: false,
		default: 'setup',
	},
	{
		name: 'anime',
		description: 'Some anime commands',
		uniqueCommands: true,
		default: '',
	},
	{
		name: 'anime2',
		description: 'Some more anime commands',
		uniqueCommands: true,
		default: '',
	},
	{
		name: 'reactionroles',
		description: 'Setup reaction roles for your server',
		uniqueCommands: false,
		default: 'list',
	},
	{
		name: 'moderation',
		description: 'Clean your server',
		uniqueCommands: true,
		default: 'family',
	},
	{
		name: 'embed',
		description: 'Create and modify embeds.',
		uniqueCommands: true,
		default: 'setup',
	},
	{
		name: 'serverstats',
		description: 'Configure your server stats',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'marriage',
		description: 'Create your family',
		uniqueCommands: true,
		default: 'family',
	},
	{
		name: 'image',
		description: 'Enjoy image magic',
		uniqueCommands: true,
		default: '',
	},
	{
		name: 'code',
		description: 'Some useful coding commands',
		uniqueCommands: true,
		default: '',
	},
	{
		name: 'announcement',
		description: 'Create/Edit your announcement.',
		uniqueCommands: false,
		default: 'create',
	},
	{
		name: 'birthdays',
		description: 'List your birthdays.',
		uniqueCommands: false,
		default: 'list',
	},
	{
		name: 'invites',
		description: 'Configure the invites system',
		uniqueCommands: false,
		default: 'show',
	},
	{
		name: 'messages',
		description: 'Configure the messages system',
		uniqueCommands: false,
		default: 'show',
	},
	{
		name: 'stickymessages',
		description: 'Configure sticky messages',
		uniqueCommands: false,
		default: 'messages',
	},
	{
		name: 'suggestions',
		description: 'Create/Deny/Accept suggestions',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'thanks',
		description: 'Thank users for their help',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'tickets',
		description: 'Various ticket commands',
		uniqueCommands: true,
		default: 'list',
	},
	{
		name: 'tools',
		description: 'Various commands to help you',
		uniqueCommands: true,
		default: '',
	},
	{
		name: 'owner',
		description: 'Private commands for the owners',
		uniqueCommands: true,
		default: '',
	},
];
for (let i = 0; i < categories.length; i++) {
	bot.amethystUtils.createCategory(categories[i]);
}

bot.rest = createRestManager({
	token: DISCORD_TOKEN,
	secretKey: REST_AUTHORIZATION,
	customUrl: REST_URL,
});

bot.amethystUtils.createInhibitor('upvoteonly', async (b, command, options): Promise<true | AmethystError> => {
	if (command.extras.upvoteOnly) {
		if (options && options.guildId) {
			let guildDB = await Functions.findOne({ Guild: options.guildId + '' });
			if (!guildDB)
				guildDB = new Functions({
					Guild: options.guildId + '',
				});
			if (guildDB.isPremium === 'true') return true;
		}
		try {
			if (process.env.TOPGG_TOKEN) {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 3000);
				const response = await fetch(`https://top.gg/api/bots/${bot.user.id}/check?userId=${options?.memberId}`, {
					signal: controller.signal,
					headers: {
						authorization: process.env.TOPGG_TOKEN,
					},
				});
				clearTimeout(timeoutId);
				const json: any = await response.json();
				if (json.voted == 1) return true;
				return {
					//@ts-ignore
					type: ErrorEnums.OTHER,
					value:
						'You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at http://patreon.com/aeonadiscord __ and remove all ads.',
				};
			}
		} catch (e) {
			console.log(e);
			return true;
		}

		return {
			//@ts-ignore
			type: ErrorEnums.OTHER,
			value:
				'You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at http://patreon.com/aeonadiscord __ and remove all ads.',
		};
	}
	return true;
});

//Wait for 10 seconds
setTimeout(() => {
	startBot(bot);
}, 10000);
