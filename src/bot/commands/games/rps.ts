import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'rps',
	description: 'Play a game of rock paper scissors',
	commandType: ['application', 'message'],
	category: 'game',
	args: [
		{
			name: 'option',
			description: 'rock/paper/scissors',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const option = ctx.options.getString('option', true).toLowerCase();

		const options = ['rock', 'paper', 'scissors'];

		if (!['rock', 'paper', 'scissors'].includes(option))
			return client.extras.errUsage({ usage: 'rps rock/paper/scissors', type: 'edit' }, ctx);

		const result = options[Math.floor(Math.random() * options.length)];

		switch (option) {
			case 'rock':
				if (result == 'paper')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, I win!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'scissors')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, You win!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'rock')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, It's a draw!`,
							type: 'reply',
						},
						ctx,
					);
				break;

			case 'paper':
				if (result == 'paper')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, It's a draw!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'scissors')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, I win!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'rock')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, You win!`,
							type: 'reply',
						},
						ctx,
					);
				break;

			case 'scissors':
				if (result == 'paper')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, You win!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'scissors')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, It's a draw!`,
							type: 'reply',
						},
						ctx,
					);

				if (result == 'rock')
					return client.extras.embed(
						{
							title: `Rock paper scissors`,
							desc: `I have ${result}, I win!`,
							type: 'reply',
						},
						ctx,
					);
				break;
		}
	},
};
