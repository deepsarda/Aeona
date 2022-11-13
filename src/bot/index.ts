import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { EVENT_HANDLER_URL } from '../configs.js';
import { RequestHandler } from './rest/RequestHandler.js';
import bodyParser from 'body-parser';
import { inspect } from 'util';
import { DiscordHTTPError } from './rest/errors/DiscordHTTPError.js';
import { DiscordRESTError } from './rest/errors/DiscordRESTError.js';
import fs from 'fs';
const EVENT_HANDLER_PORT = process.env.EVENT_HANDLER_PORT as string;
const reqHandler = new RequestHandler(`Bot ${process.env.DISCORD_TOKEN!}`);

export const cache = new AmethystCollection<string, any>();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', async (req, res): Promise<any> => {
	if (!process.env.REST_AUTHORIZATION || process.env.REST_AUTHORIZATION !== req.headers.authorization)
		return res.status(401).send({ error: 'Invalid authorization key.' });

	try {
		if (!['get', 'post', 'put', 'delete', 'patch'].includes(req.method.toLowerCase()))
			return console.error(`Unknown Request Method Received!\nMethod: ${req.method.toLowerCase()}`);

		if (Object.keys(req.query).length) {
			if (!Object.keys(req.body).length) req.body = req.query;
			else req.body = { ...req.body, ...req.query };
		}

		if (!Object.keys(req.body).length) req.body = undefined;
		if (req.method.toLowerCase() == 'get') {
			if (cache.get(req.url.split('?')[0])) return cache.get(req.url.split('?')[0]);

			if (cache.has(req.url.split('?')[0])) {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					await sleep(100);
					const result = cache.get(req.url.split('?')[0]);
					if (result) return result;
				}
			}

			cache.set(req.url.split('?')[0], undefined);

			// TODO: Remove this
			console.log(req.method, `/api${req.url.split('?')[0]}`);
			let result;
			for (let i = 0; i < 10; i++) {
				result = await reqHandler.request(
					req.method,
					`/api${req.url.split('?')[0]}`,
					req.body,
					req.body?.file
						? req?.body?.file?.map((f: any) => ({
								file: Buffer.from(f.blob.split('base64')[1], 'base64'),
								name: f.name,
						  }))
						: undefined,
				);
				if (result) break;
				await sleep(100);
			}
			if (result) {
				console.log('RESOLVED', req.method, `/api${req.url.split('?')[0]}`);
				cache.set(req.url.split('?')[0], result);
				setInterval(() => {
					cache.delete(req.url.split('?')[0]);
				}, 1000);
				res.status(200).send(result);
			} else {
				cache.delete(req.url.split('?')[0]);
				res.status(204).send(undefined);
			}
		} else {
			console.log(req.method, `/api${req.url.split('?')[0]}`);
			let result;
			while (!result) {
				result = await reqHandler.request(
					req.method,
					`/api${req.url.split('?')[0]}`,
					req.body,
					req.body?.file
						? req?.body?.file?.map((f: any) => ({
								file: Buffer.from(f.blob.split('base64')[1], 'base64'),
								name: f.name,
						  }))
						: undefined,
				);
			}
			console.log('RESOLVED', req.method, `/api${req.url.split('?')[0]}`);
			res.status(200).send(result);
		}
	} catch (error) {
		if (error instanceof DiscordHTTPError || error instanceof DiscordRESTError) {
			const errorTexts = {
				[HTTPResponseCodes.BadRequest]: "The options was improperly formatted, or the server couldn't understand it.",
				[HTTPResponseCodes.Unauthorized]: 'The Authorization header was missing or invalid.',
				[HTTPResponseCodes.Forbidden]: 'The Authorization token you passed did not have permission to the resource.',
				[HTTPResponseCodes.NotFound]: "The resource at the location specified doesn't exist.",
				[HTTPResponseCodes.MethodNotAllowed]: 'The HTTP method used is not valid for the location specified.',
				[HTTPResponseCodes.GatewayUnavailable]:
					'There was not a gateway available to process your options. Wait a bit and retry.',
			};

			const err = {
				ok: false,
				status: error.res.statusCode,
				error: errorTexts[error.res.statusCode as keyof typeof errorTexts] || 'REQUEST_UNKNOWN_ERROR',
				body: JSON.stringify(error.response),
			};

			res.status(500).send(error);

			if (err.status >= 400 && err.status < 500)
				fs.appendFileSync(
					'4xx-errors.log',
					`Received a 4xx response!\nStatus Code: ${err.status}\nMethod: ${req.method}\nRoute: ${
						req.url
					}\nError: ${inspect(
						err,
					)}\nTimeStamp: ${Date.now()}\nTime: ${new Date().toUTCString()}\n------------------------------------\n`,
				);
		} else {
			console.error(error);

			fs.appendFileSync('rest-errors.log', inspect(error));
		}
	}
});

app.listen(EVENT_HANDLER_PORT, () => {
	console.log(`Bot is listening at ${EVENT_HANDLER_URL};`);
});

import { bot } from './bot.js';
import { HTTPResponseCodes } from 'discordeno/types';
import { AmethystCollection } from '@thereallonewolf/amethystframework';
console.log(bot.applicationId);
