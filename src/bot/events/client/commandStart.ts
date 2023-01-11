import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { CommandClass } from '@thereallonewolf/amethystframework';
import { Interaction, Message } from 'discordeno/transformers';

import Schema from '../../database/models/votecredits.js';
import { AeonaBot } from '../../extras/index.js';

const INFLUX_ORG = process.env.INFLUX_ORG as string;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
const INFLUX_URL = process.env.INFLUX_URL as string;
const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;
export const Influx = influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
export default async (bot: AeonaBot, command: CommandClass, data: Interaction | Message) => {
	Influx?.writePoint(new Point('commandruncount').tag('action', 'addition').intField('usage', 1));
	Influx?.writePoint(new Point('commands').tag('action', 'addition').tag('command', command.name).intField('value', 1));
	let user = await Schema.findOne({ User: data.member?.id });
	console.log(`BOT`.blue.bold, `>>`.white, `Command Run: `.red, command.name.yellow,);
	if (!user) user = new Schema({ User: data.member?.id });
	if (user.LastVersion != bot.extras.version)
		bot.helpers.sendMessage(data.channelId!, {
			content: 'You have unread news. Use `+news` to read it',
		});
};
