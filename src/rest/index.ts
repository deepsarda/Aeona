import { InfluxDB, Point } from '@influxdata/influxdb-client';
import bodyParser from 'body-parser';
import colors from 'colors';
import { HTTPResponseCodes } from 'discordeno/types';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import { inspect } from 'util';

import { REST_URL } from '../configs.js';
import { DiscordHTTPError } from './errors/DiscordHTTPError.js';
import { DiscordRESTError } from './errors/DiscordRESTError.js';
import { RequestHandler } from './RequestHandler.js';

dotenv.config();
const REST_PORT = process.env.REST_PORT as string;
const reqHandler = new RequestHandler(`Bot ${process.env.DISCORD_TOKEN!}`);
let requestCount = 0;
const app = express();

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.all('*', async (req, res): Promise<any> => {
	if (!process.env.REST_AUTHORIZATION || process.env.REST_AUTHORIZATION !== req.headers.authorization) {
		return res.status(401).send({ error: 'Invalid authorization key.' });
	}
	requestCount++;
	try {
		if (!['get', 'post', 'put', 'delete', 'patch'].includes(req.method.toLowerCase())) {
			return console.error(`Unknown Request Method Received!\nMethod: ${req.method.toLowerCase()}`);
		}

		if (Object.keys(req.query).length) {
			if (!Object.keys(req.body).length) req.body = req.query;
			else req.body = { ...req.body, ...req.query };
		}

		if (!Object.keys(req.body).length) req.body = undefined;
		console.log(req.method.yellow, `/api${req.url.split('?')[0]}`.magenta);
		const result = await reqHandler.request(
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
		if (result) {
			console.log('RESOLVED'.green, req.method.yellow, `/api${req.url.split('?')[0]}`.magenta);
			res.status(200).send(result);
		} else {
			console.log('UNABLE TO RESOLVE'.red, req.method.yellow, `/api${req.url.split('?')[0]}`.magenta);
			res.status(204).send(undefined);
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

			res.status(500).send(err);

			if (err.status >= 400 && err.status < 500) {
				fs.appendFileSync(
					'4xx-errors.log',
					`Received a 4xx response!\nStatus Code: ${err.status}\nMethod: ${req.method}\nRoute: ${
						req.url
					}\nError: ${inspect(
						err,
					)}\nTimeStamp: ${Date.now()}\nTime: ${new Date().toUTCString()}\n------------------------------------\n`,
				);
			}
		} else {
			console.error(error);

			fs.appendFileSync('rest-errors.log', inspect(error));
		}
	}
});

app.listen(REST_PORT, () => {
	console.log(colors.green(`Rest is listening at ${REST_URL};`));

	setInterval(() => {
		const INFLUX_ORG = process.env.INFLUX_ORG as string;
		const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
		const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
		const INFLUX_URL = process.env.INFLUX_URL as string;

		const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;
		const Influx = influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
		Influx?.writePoint(
			new Point('rest') //
				.tag('action', 'sync')
				.floatField('length', requestCount / 10),
		);

		requestCount = 0;
	}, 10 * 1000);
});
