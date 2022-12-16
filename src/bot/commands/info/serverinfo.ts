import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import { ChannelTypes } from 'discordeno';
export default {
	name: 'serverinfo',
	description: 'Get information about this server',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const verifLevels = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵  ┻━┻',
			VERY_HIGH: '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻',
		};

		const region = {
			brazil: `:flag_br: `,
			'eu-central': `:flag_eu: `,
			singapore: `:flag_sg: `,
			'us-central': `:flag_us: `,
			sydney: `:flag_au: `,
			'us-east': `:flag_us: `,
			'us-south': `:flag_us: `,
			'us-west': `:flag_us: `,
			'eu-west': `:flag_eu: `,
			'vip-us-east': `:flag_us: `,
			europe: `:flag_gb:`,
			amsterdam: `:flag_nl:`,
			hongkong: `:flag_hk: `,
			russia: `:flag_ru: `,
			southafrica: `:flag_za: `,
		};

		const tier = {
			TIER_1: `1`,
			TIER_2: `2`,
			TIER_3: `3`,
			NONE: `0`,
		};
		const channels = await client.helpers.getChannels(ctx.guild!.id);
		client.extras.embed(
			{
				title: `Server Information`,
				desc: `Information about the server ${ctx.guild.name}`,
				thumbnail: client.helpers.getGuildIconURL(ctx.guild!.id + '', undefined),
				image: client.helpers.getGuildIconURL(ctx.guild!.id + '', undefined),
				fields: [
					{
						name: 'Server name:',
						value: `${ctx.guild.name}`,
						inline: true,
					},
					{
						name: 'Server id:',
						value: `${ctx.guild!.id}`,
						inline: true,
					},
					{
						name: 'Owner: ',
						value: `<@!${ctx.guild.ownerId}>`,
						inline: true,
					},
					{
						name: 'Verify level: ',
						value: `${verifLevels[ctx.guild.verificationLevel]}`,
						inline: true,
					},
					{
						name: 'Boost tier: ',
						value: `Tier ${tier[ctx.guild.premiumTier] || 'None'}`,
						inline: true,
					},
					{
						name: 'Boost count:',
						value: `${ctx.guild.premiumSubscriptionCount || '0'} boosts`,
						inline: true,
					},

					{
						name: 'Members:',
						value: `${ctx.guild.approximateMemberCount} members!`,
						inline: true,
					},

					{
						name: 'Text Channels: ',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.GuildText).size} channels!`,
						inline: true,
					},
					{
						name: 'Voice Channels:',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.GuildVoice).size} channels!`,
						inline: true,
					},
					{
						name: 'Stage Channels:',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.GuildStageVoice).size} channels!`,
						inline: true,
					},
					{
						name: 'News Channels:',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.GuildAnnouncement).size} channels!`,
						inline: true,
					},
					{
						name: 'Public Threads:',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.PublicThread).size} threads!`,
						inline: true,
					},
					{
						name: 'Private Threads:',
						value: `${channels.filter((channel) => channel.type === ChannelTypes.PrivateThread).size} threads!`,
						inline: true,
					},
					{
						name: 'Roles:',
						value: `${ctx.guild.roles.size} roles!`,
						inline: true,
					},
					{
						name: 'Emoji count:',
						value: `${ctx.guild.emojis.size} emoji's`,
						inline: true,
					},
					{
						name: 'Sticker count:',
						value: `${(await client.helpers.getGuildStickers(ctx.guild!.id!)).size} stickers`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
