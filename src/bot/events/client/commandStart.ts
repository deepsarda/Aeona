import { AmethystBot, AmethystEmbed, CommandClass } from '@thereallonewolf/amethystframework';
import { Interaction, Message } from 'discordeno/transformers';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
const INFLUX_ORG = process.env.INFLUX_ORG as string;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
const INFLUX_URL = process.env.INFLUX_URL as string;

const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;
export const Influx = influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
export default async (bot: AmethystBot, command: CommandClass, data: Interaction | Message) => {
	const embed = new AmethystEmbed()
		.setTitle(`Command Ran`)
		.addField(
			'User:',
			'<@' +
				data.member.id +
				'> \n' +
				data.member.user.username +
				'#' +
				data.member.user.discriminator +
				`(${data.member.id})`,
		)
		.addField('Channel:', (await bot.cache.channels.get(data.channelId)).name)
		.addField('Guild:', (await bot.cache.guilds.get(data.guildId)).name);

	//@ts-ignore
	if (data.content) embed.addField('Content:', data.content);
	//@ts-ignore
	else if (data.data.options)
		embed.addField(
			'Content:',
			//@ts-ignore
			data.data.options.map((option) =>
				option.value.options ? option.value.options.map((option) => option.value) : option.value,
			),
		);
	bot.extras.webhook({
		username: 'Logs',
		embeds: [embed],
	});

	console.log('HMMM');
	Influx?.writePoint(new Point('commandruncount').tag('action', 'addition').intField('usage', 1));
	Influx?.writePoint(new Point('commands').tag('action', 'addition').tag('command', command.name).intField('value', 1));
};
