import Schema from '../../database/models/family.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
export default {
	name: 'adopt',
	description: 'Adopt a user',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'The user to adopt',
			required: true,
			optionType: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = ctx.options.getUser('user', true);
		const author = ctx.user;

		if (author.id == target.id)
			return client.extras.errNormal(
				{
					error: 'You cannot adopt yourself',
					type: 'editreply',
				},
				ctx,
			);

		if (target.toggles.bot)
			return client.extras.errNormal(
				{
					error: 'You cannot adopt a bot',
					type: 'editreply',
				},
				ctx,
			);

		const familyMember = await Schema.findOne({
			Guild: ctx.guildId,
			User: target.id,
			Parent: author.id,
		});
		const familyMember2 = await Schema.findOne({
			Guild: ctx.guildId,
			User: author.id,
			Parent: target.id,
		});
		const familyMember3 = await Schema.findOne({
			Guild: ctx.guildId,
			User: author.id,
			Partner: target.id,
		});

		if (familyMember || familyMember2 || familyMember3) {
			return client.extras.errNormal(
				{
					error: `You cannot adopt a family member!`,
					type: 'editreply',
				},
				ctx,
			);
		}

		const checkAdopt = await Schema.findOne({
			Guild: ctx.guildId,
			Children: target.username,
		});
		if (checkAdopt) {
			return client.extras.errNormal(
				{
					error: `This user has already been adopted`,
					type: 'editreply',
				},
				ctx,
			);
		}

		const row = new Components()
			.addButton('Yes', 'Success', 'adopt_yes', { emoji: '✅' })
			.addButton('No', 'Danger', 'adopt_deny', { emoji: '❌' });

		const message: Message = await client.extras.embed(
			{
				title: `Adoption`,
				desc: `${author} has ${target} asked to adopt him! \n${target} click on one of the buttons`,
				components: row,
				content: `${target}`,
				type: 'editreply',
			},
			ctx,
		);

		const filter = (i: { user: { id: bigint } }) => i.user.id === target.id;
		client.amethystUtils
			.awaitComponent(message.id, {
				filter: filter,
				type: 'Button',
			})
			.then(async (i) => {
				if (i.data?.customId == 'adopt_yes') {
					Schema.findOne(
						{ Guild: ctx.guildId, User: author.id },
						async (err: any, data: { Children: string[]; save: () => void }) => {
							if (data) {
								data.Children.push(target.username);
								data.save();
							} else {
								new Schema({
									Guild: ctx.guildId,
									User: author.id,
									Children: target.username,
								}).save();
							}
						},
					);

					Schema.findOne(
						{ Guild: ctx.guildId, User: target.id },
						async (err: any, data: { Parent: string[]; save: () => void }) => {
							if (data) {
								data.Parent.push(author.username);
								data.save();
							} else {
								new Schema({
									Guild: ctx.guildId,
									User: target.id,
									Parent: author.username,
								}).save();
							}
						},
					);

					client.extras.embed(
						{
							title: `Adoption - Approved`,
							desc: `${author} is now the proud parent of ${target}! 🎉`,
							components: [],
							type: 'editreply',
						},
						ctx,
					);
				}

				if (i.data?.customId == 'adopt_deny') {
					client.extras.embed(
						{
							title: `Adoption - Denied`,
							desc: `${target} don't want to be adopted by ${author}`,
							components: [],
							type: 'editreply',
						},
						ctx,
					);
				}
			})
			.catch(() => {
				client.extras.embed(
					{
						title: `Adoption - Denied`,
						desc: `${target} has not answered anything! The adoption is canceled`,
						components: [],
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
