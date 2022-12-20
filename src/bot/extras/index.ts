import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
import { Channel, Role } from 'discordeno/*';
import { BigString } from 'discordeno/types';
import botConfig from '../botconfig/bot.js';
import Schema from '../database/models/logChannels.js';
import Stats from '../database/models/stats.js';
import ticketChannels from '../database/models/ticketChannels.js';
import ticketSchema from '../database/models/tickets.js';
import { createTranscript } from '../transcripts/index.js';
import embeds from './embed.js';
import levels from '../database/models/levels.js';

export interface AeonaBot extends AmethystBot {
	extras: ReturnType<typeof additionalProps>;
}

const parts = process.env.WEBHOOKURL!.split('/');
const token = parts.pop() || '';
const id = parts.pop();
export function additionalProps(client: AeonaBot) {
	return {
		...embeds(client),
		version: 'v0.1.6',
		webhook: async (content: any) => {
			return await client.helpers.sendWebhookMessage(id as BigString, token, content);
		},
		startTime: new Date().getTime(),
		config: botConfig,
		colors: botConfig.colors,
		emotes: botConfig.emotes,
		messageCount: 0,
		ready: false,
		capitalizeFirstLetter: (string: string) => {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		buttonReactions: function (id: any, reactions: any[]) {
			const comp = new Components();
			for (const reaction of reactions) {
				comp.addButton('', 'Secondary', `reaction_button-${reaction}`, {
					emoji: `${reaction}`,
				});
			}

			return comp;
		},
		getLogs: async function (guildId: any) {
			const data = await Schema.findOne({ Guild: guildId });
			if (data && data.Channel) {
				const channel = await client.helpers.getChannel(BigInt(data.Channel));
				return channel;
			} else {
				return false;
			}
		},
		createChannelSetup: async function (Schema: any, channel: Channel, interaction: Context) {
			Schema.findOne({ Guild: interaction.guildId }, async (err: any, data: { Channel: bigint; save: () => void }) => {
				if (data) {
					data.Channel = channel.id;
					data.save();
				} else {
					new Schema({
						Guild: interaction.guildId,
						Channel: channel.id + '',
					}).save();
				}
			});

			client.extras.embed(
				{
					title: 'Successful!',
					desc: `Channel has been set up successfully!`,
					fields: [
						{
							name: `→ Channel`,
							value: `<#${channel.id}> (${channel.id})`,
						},
					],
					type: 'reply',
				},
				interaction,
			);
		},
		createRoleSetup: async function (Schema: any, role: Role, interaction: Context) {
			Schema.findOne({ Guild: interaction.guildId }, async (err: any, data: { Role: bigint; save: () => void }) => {
				if (data) {
					data.Role = role.id;
					data.save();
				} else {
					new Schema({
						Guild: interaction.guildId,
						Role: role.id + '',
					}).save();
				}
			});

			client.extras.embed(
				{
					title: `Successful`,
					desc: `Role has been set up successfully!`,
					fields: [
						{
							name: `→ Role`,
							value: `<@&${role.id}> (${role.id})`,
						},
					],
					type: 'reply',
				},
				interaction,
			);
		},
		generateEmbed: async function (start: any, end: number, lb: any[], title: any) {
			const current = lb.slice(start, end + 10);
			const result = current.join('\n');

			const embed = client.extras.templateEmbed().setTitle(`${title}`).setDescription(`${result.toString()}`);

			return embed;
		},

		createLeaderboard: async function (title: any, lb: any[], interaction: Context, currentIndex?: number) {
			if (!currentIndex) currentIndex = 0;
			let btn1 = true;
			let btn2 = true;

			if (currentIndex !== 0) btn1 = false;
			if (currentIndex + 10 < lb.length) btn2 = false;
			const comp = new Components()
				.addButton('Previous', 'Secondary', 'back_button', {
					emoji: '⬅️',
					disabled: btn1,
				})
				.addButton('Next', 'Secondary', 'forward_button', {
					emoji: '⬅️',
					disabled: btn2,
				});

			const msg = await interaction.reply({
				embeds: [await client.extras.generateEmbed(currentIndex, currentIndex, lb, title)],
				components: comp,
			});

			if (lb.length <= 10) return;
			client.amethystUtils
				// eslint-disable-next-line
				.awaitComponent(msg.message!.id, {
					timeout: 60_000,
					type: 'Button',
				})
				.then(async (btn) => {
					if (!currentIndex) return;

					btn.data?.customId === 'back_button' ? (currentIndex -= 10) : (currentIndex += 10);
					client.extras.createLeaderboard(title, lb, interaction, currentIndex);
				});
		},
		getTemplate: async (guild: bigint) => {
			try {
				const data = await Stats.findOne({ Guild: guild });

				if (data && data.ChannelTemplate) {
					return data.ChannelTemplate;
				} else {
					return `{emoji} {name}`;
				}
			} catch {
				return `{emoji} {name}`;
			}
		},
		getTicketData: async function (interaction: Context) {
			const ticketData = await ticketSchema.findOne({
				Guild: interaction.guildId,
			});
			if (!ticketData) return false;

			return ticketData;
		},

		getChannelTicket: async function (interaction: Context) {
			const ticketChannelData = await ticketChannels.findOne({
				Guild: interaction.guildId,
				channelID: interaction.channel?.id + '',
			});
			return ticketChannelData;
		},

		isTicket: async function (interaction: Context) {
			const ticketChannelData = await ticketChannels.findOne({
				Guild: interaction.guild!.id + '',
				channelID: interaction.channel!.id + '',
			});

			if (ticketChannelData) {
				return true;
			} else {
				return false;
			}
		},

		transcript: async function (client: AeonaBot, channel: Channel) {
			const file = await createTranscript(client, channel);
			client.helpers.sendMessage(channel.id + '', {
				file: [file],
			});
		},
		setXP: async function (userId: bigint, guildId: bigint, xp: number) {
			const user = await levels.findOne({ userID: userId, guildID: guildId });
			if (!user) return false;

			user.xp = xp;
			user.level = Math.floor(0.1 * Math.sqrt(user.xp));
			user.lastUpdated = new Date();

			user.save();

			return user;
		},

		setLevel: async function (userId: bigint, guildId: bigint, level: number) {
			const user = await levels.findOne({ userID: userId, guildID: guildId });
			if (!user) return false;

			user.level = level;
			user.xp = level * level * 100;
			user.lastUpdated = new Date();

			user.save();

			return user;
		},
		addXP: async function (userId: bigint, guildId: bigint, xp: number) {
			const user = await levels.findOne({ userID: userId, guildID: guildId });

			if (!user) {
				new levels({
					userID: userId,
					guildID: guildId,
					xp: xp,
					level: Math.floor(0.1 * Math.sqrt(xp)),
				}).save();

				return Math.floor(0.1 * Math.sqrt(xp)) > 0;
			}

			user.xp += xp;
			user.level = Math.floor(0.1 * Math.sqrt(user.xp));
			user.lastUpdated = new Date();

			await user.save();

			return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
		},

		addLevel: async function (userId: bigint, guildId: bigint, level: string) {
			const user = await levels.findOne({ userID: userId, guildID: guildId });
			if (!user) return false;

			user.level += parseInt(level, 10);
			user.xp = user.level * user.level * 100;
			user.lastUpdated = new Date();

			user.save();

			return user;
		},

		fetchLevels: async function (userId: bigint, guildId: bigint, fetchPosition = true) {
			const user = await levels.findOne({
				userID: userId,
				guildID: guildId,
			});
			const userReturn = {
				...user,
				position: 0,
				cleanXp: 0,
				cleanNextLevelXp: 0,
			};
			if (!user) return false;

			if (fetchPosition === true) {
				const leaderboard = await levels
					.find({
						guildID: guildId,
					})
					.sort([['xp', -1]])
					.exec();

				userReturn.position = leaderboard.findIndex((i) => i.userID === userId + '') + 1;
			}
			
			userReturn.cleanXp = user.xp - client.extras.xpFor(user.level);
			userReturn.cleanNextLevelXp = client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);
			console.log(userReturn);
			return userReturn;
		},

		xpFor: function (targetLevel: number) {
			return targetLevel * targetLevel * 100;
		},
	};
}
