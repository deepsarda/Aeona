import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { EVENT_HANDLER_URL } from '../configs.js';
import { RequestHandler } from './Rest/RequestHandler.js';
import bodyParser from 'body-parser';
import { inspect } from 'util';
import { DiscordHTTPError } from './Rest/errors/DiscordHTTPError.js';
import { DiscordRESTError } from './Rest/errors/DiscordRESTError.js';
import fs from 'fs';
const EVENT_HANDLER_PORT = process.env.EVENT_HANDLER_PORT as string;
const reqHandler = new RequestHandler(`Bot ${process.env.DISCORD_TOKEN!}`);
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

		// TODO: Remove this
		console.log(req.method, `/api${req.url.split('?')[0]}`);

		const result = await reqHandler.request(
			req.method,
			`/api${req.url.split('?')[0]}`,
			req.body,
			req.body?.file
				? req?.body?.file?.map((f: any) => ({ file: Buffer.from(f.blob.split('base64')[1], 'base64'), name: f.name }))
				: undefined,
		);
		if (result) res.status(200).send(result);
		else res.status(204).send(undefined);
	} catch (error) {
		if (error instanceof DiscordHTTPError || error instanceof DiscordRESTError) {
			// eslint-disable-next-line
			error = { ok: false, status: error.res.statusCode, body: JSON.stringify(error.response) };

			res.status(500).send(error);

			if (error.status >= 400 && error.status < 500)
				fs.appendFileSync(
					'4xx-errors.log',
					`Received a 4xx response!\nStatus Code: ${error.status}\nMethod: ${req.method}\nRoute: ${
						req.url
					}\nError: ${inspect(
						error,
					)}\nTimeStamp: ${Date.now()}\nTime: ${new Date().toUTCString()}\n------------------------------------\n`,
				);
		} else console.error(error);
	}
});

app.listen(EVENT_HANDLER_PORT, () => {
	console.log(`Bot is listening at ${EVENT_HANDLER_URL};`);
});

import { bot } from './bot.js';
console.log(bot.applicationId);
