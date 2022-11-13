import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'roast',
	description: 'Roast a user.',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await ctx.options.getUser('user', true);

		const roasts = [
			"I'd offer you some gum but your smiles got plenty of it.",
			'Your body fat is about as evenly distributed as wealth in the US economy.',
			"You're like dobby from harry potter, only people won't be sad when you die in the seventh book.",
			'You have the kinds of looks that make people talk about your personality.',
			'You look like the result of pressing random on the character creation menu.',
			'You look like the after picture of a meth ad.',
			"Even the shower doesn't want to see you naked.",
			'I bet you wear a nose ring because no one wants to put one on your finger.',
			'When the airforce needs extra landing space they should just rent out your forehead.',
			'If laughter is the best medicine, your face must be curing the world.',
			'Tt looks like your face caught fire and someone tried to put it out with a hammer.',
			'Your family tree must be a cactus because everyone on it is a prick.',
			"Save your breath - you're going to need it to blow up your date.",
			"You're proof evolution can go in reverse.",
			'When you were born, the doctor came out to the waiting room and said to your dad, "I\'m very sorry. We did everything we could. But he pulled through."',
			"I wasn't born with enough middle fingers to let you know how I feel about you.",
			"Mirrors can't talk, and lucky for you they can't laugh either.",
			'Your IQ is lower than the Mariana Trench.',
			"You're so annoying even the flies stay away from your stench.",
			"I'd give you a nasty look but you've already got one.",
			'Someday you will go far, and I hope you stay there.',
			"The zoo called. They're wondering how you got out of your cage.",
			'I was hoping for a battle of wits, but you appear to be unarmed.',
			"Brains aren't everything, in your case, they're nothing.",
			'We all sprang from apes, but you did not spring far enough.',
			'Even monkeys can go to space, so clearly you lack some potential.',
			"I'd help you succeed but you're incapable.",
			'Your hairline is built like a graph chart, positive and negative forces attract but the clippers and your hair repel.',
			"You have two parts of your brain, 'left' and 'right'. In the left side, there's nothing right. In the right side, there's nothing left.",
			'Is your ass jealous of the amount of shit that just came out of your mouth?',
			"You must have been born on a highway because that's where most accidents happen.",
			"You're so ugly, when your mom dropped you off at school she got a fine for littering.",
			"The only way you'll ever get laid is if you crawl up a chicken's ass and wait.",
			"I'm jealous of all the people that haven't met you!",
			"If I had a face like yours, I'd sue my parents.",
			"There's only one problem with your face. I can see it.",
			"Don't you love nature, despite what it did to you?",
			"Brains aren't everything. In your case they're nothing.",
			'Oh, what? Sorry. I was trying to imagine you with a personality.',
			'Hell is wallpapered with all your deleted selfies.',
			'You have the perfect face for radio.',
		];

		client.extras.embed(
			{
				title: `Roast`,
				desc: `${user}, ${roasts[Math.floor(Math.random() * roasts.length)]}`,
				type: 'reply',
			},
			ctx,
		);
	},
};
