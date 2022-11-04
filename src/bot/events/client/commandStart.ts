import { Point } from '@influxdata/influxdb-client';
import { AmethystBot, CommandClass } from '@thereallonewolf/amethystframework';
import { Interaction, Message } from 'discordeno/transformers';
import { Influx } from '../../../analytics.js';
export default async (bot: AmethystBot, command: CommandClass, data: Interaction | Message) => {
	Influx?.writePoint(new Point('commandStart').tag('commandName', command.name));
};
