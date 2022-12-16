import weather from 'weather-js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'weather',
	description: 'Get the latest weather',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'location',
			description: 'the location to get the weather for',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const country = ctx.options.getString('location', true);

		weather.find({ search: country, degreeType: 'C' }, function (error, result) {
			if (result === undefined || result.length === 0)
				return client.extras.errNormal(
					{
						error: '**Invalid** location',
						type: 'editreply',
					},
					ctx,
				);

			const current = result[0].current;
			const location = result[0].location;

			client.extras.embed(
				{
					title: `☀️ Weather - ${current.skytext}`,
					desc: `Weather forecast for ${current.observationpoint}`,
					thumbnail: current.imageUrl,
					fields: [
						{
							name: 'Timezone',
							value: `UTC${location.timezone}`,
							inline: true,
						},
						{
							name: 'Degree Type',
							value: `Celsius`,
							inline: true,
						},
						{
							name: 'Temperature',
							value: `${current.temperature}°`,
							inline: true,
						},
						{
							name: 'Wind',
							value: `${current.winddisplay}`,
							inline: true,
						},
						{
							name: 'Feels like',
							value: `${current.feelslike}°`,
							inline: true,
						},
						{
							name: 'Humidity',
							value: `${current.humidity}%`,
							inline: true,
						},
					],
					type: 'editreply',
				},
				ctx,
			);
		});
	},
} as CommandOptions;
