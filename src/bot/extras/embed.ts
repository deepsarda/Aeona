import { AmethystEmbed, Context } from '@thereallonewolf/amethystframework';
import { ActionRow, Message } from 'discordeno';

import config from '../botconfig/bot.js';
import Schema from '../database/models/functions.js';
import { AeonaBot } from './index.js';

/* Exporting a function that takes a client as a parameter. */
export default (client: AeonaBot) => {
	const templateEmbed = function () {
		return new AmethystEmbed().setColor(config.colors.normal);
	};

	const errNormal = async function (
		{
			embed: embed = templateEmbed(),
			error: error,
			type: type,
			content: content,
			components: components,
		}: {
			embed?: AmethystEmbed;
			error: string;
			type?: string;
			content?: string;
			components?: ActionRow[];
		},
		interaction: Context | { id: bigint },
	) {
		embed.setTitle(`${config.emotes.normal.error} Error!`);
		embed.setDescription(`Something went wrong!`);
		embed.addField('→ Error comment', `\`\`\`${error}\`\`\``);
		embed.setColor(config.colors.error);

		return await sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};

	const errUsage = async function (
		{
			embed: embed = templateEmbed(),
			usage: usage,
			type: type,
			content: content,
			components: components,
		}: {
			embed?: AmethystEmbed;
			usage: string;
			type?: string;
			content?: string;
			components?: ActionRow[];
		},
		interaction: Context | { id: bigint },
	) {
		embed.setTitle(`${config.emotes.normal.error} Error!`);
		embed.setDescription(`You did not provide the correct arguments`);
		embed.addField('→ Required arguments', `\`\`\`${usage}\`\`\``);
		embed.setColor(config.colors.error);

		return await sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};

	const errWait = async function (
		{
			embed: embed = templateEmbed(),
			time: time,
			type: type,
			content: content,
			components: components,
		}: {
			embed?: AmethystEmbed;
			time: number;
			content?: string;
			type?: string;
			components?: ActionRow[];
		},
		interaction: Context | { id: bigint },
	) {
		embed.setTitle(`${config.emotes.normal.error} Error!`);
		embed.setDescription(`You've already done this once`);
		embed.addField('→ Try again on', `<t:${time}:f>`);
		embed.setColor(config.colors.error);

		return await sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};

	const embed = async function (
		{
			embed: embed = templateEmbed(),
			title: title,
			desc: desc,
			color: color,
			image: image,
			author: author,
			url: url,
			footer: footer,
			thumbnail: thumbnail,
			fields: fields,
			content: content,
			components: components,
			type: type,
		}: {
			title?: string;
			desc?: string;
			color?: string;
			image?: string;
			author?: {
				name?: string;
				iconURL?: string;
			};
			thumbnail?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			url?: string;
			content?: string;
			components?: ActionRow[];
			type?: string;
			footer?: string;
			embed?: AmethystEmbed;
		},
		interaction: Context | { id: bigint; guildId?: bigint },
	) {
		if (interaction.guildId == undefined) interaction.guildId = 0n;
		const functiondata = await Schema.findOne({ Guild: interaction.guildId });

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author[0], author[1]);
		if (url) embed.url = url;
		if (footer) embed.setFooter(footer);
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);

		return await sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};

	const simpleEmbed = async function (
		{
			title: title,
			desc: desc,
			color: color,
			image: image,
			author: author,
			thumbnail: thumbnail,
			fields: fields,
			url: url,
			content: content,
			components: components,
			type: type,
		}: {
			title?: string;
			desc?: string;
			color?: string;
			image?: string;
			author?: {
				name?: string;
				iconURL?: string;
			};
			thumbnail?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			url?: string;
			content?: string;
			components?: ActionRow[];
			type?: string;
		},
		interaction: Context | { id: bigint; guildId?: bigint },
	) {
		const functiondata = await Schema.findOne({ Guild: interaction.guildId });

		const embed = new AmethystEmbed().setColor(config.colors.normal);

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author[0], author[1]);
		if (url) embed.url = url;
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);

		return await sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};

	const simpleMessageEmbed = async function (
		{
			title: title,
			desc: desc,
			color: color,
			image: image,
			author: author,
			thumbnail: thumbnail,
			fields: fields,
			url: url,
			content: content,
			components: components,
		}: {
			title?: string;
			desc?: string;
			color?: string;
			image?: string;
			author?: {
				name?: string;
				iconURL?: string;
			};
			thumbnail?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			url?: string;
			content?: string;
			components?: ActionRow[];
		},
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(config.colors.normal);

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author[0], author[1]);
		if (url) embed.url = url;
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);
		return await client.helpers
			.sendMessage(ctx.channelId, {
				embeds: [embed],
				content: content,
				components: components,
			})
			.catch();
	};

	const editEmbed = async function (
		{
			title: title,
			desc: desc,
			color: color,
			image: image,
			author: author,
			thumbnail: thumbnail,

			fields: fields,
			url: url,
			content: content,
			components: components,
		}: {
			title?: string;
			desc?: string;
			color?: string;
			image?: string;
			author?: {
				name?: string;
				iconURL?: string;
			};
			thumbnail?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			url?: string;
			content?: string;
			components?: ActionRow[];
		},
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(config.colors.normal);

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author[0], author[1]);
		if (url) embed.url = url;
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);

		return await client.helpers
			.editMessage(ctx.channelId, ctx.id + '', {
				embeds: [embed],
				content: content,
				components: components,
			})
			.catch();
	};
	const succNormal = async function (
		{
			embed: embed = templateEmbed(),
			text: text,
			fields: fields,
			type: type,
			content: content,
			components: components,
		}: {
			embed?: AmethystEmbed;
			text?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			content?: string;
			components?: ActionRow[];
			type?: string;
		},
		interaction: Context | { id: bigint },
	) {
		embed.setTitle(`${client.extras.emotes.normal.check}・Success!`);
		embed.setDescription(`${text}`);
		embed.setColor(client.extras.config.colors.succes);

		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		type = 'editreply';
		return client.extras.sendEmbed(
			{
				embeds: [embed],
				content: content,
				components: components,
				type: type,
			},
			interaction,
		);
	};
	const sendEmbedMessage = async function (
		{
			title: title,
			desc: desc,
			color: color,
			image: image,
			author: author,
			thumbnail: thumbnail,
			fields: fields,
			url: url,
			content: content,
			components: components,
		}: {
			title?: string;
			desc?: string;
			color?: string;
			image?: string;
			author?: string;
			thumbnail?: string;
			fields?: {
				name: string;
				value: string;
				inline?: boolean;
			}[];
			url?: string;
			content?: string;
			components?: ActionRow[];
		},
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(config.colors.normal);

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author[0], author[1]);
		if (url) embed.url = url;
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);

		return await client.helpers
			.sendMessage(ctx.channelId, {
				embeds: [embed],

				content: content,
				components: components,
			})
			.catch();
	};
	const sendEmbed = async function (
		{
			embeds: embeds,
			content: content,
			components: components,
			type: type,
		}: {
			embeds: AmethystEmbed[];
			content?: string;
			components?: ActionRow[];
			type?: string;
		},
		ctx: Context | { id: bigint },
	) {
		if (ctx instanceof Context) {
			let s = [
				'\n discord.gg/qURxRRHPwa',
				'\n Upvote me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote',
			];
			let guildDB = await Schema.findOne({ Guild: ctx.guildId + '' });
			if (!guildDB)
				guildDB = new Schema({
					Guild: ctx.guildId + '',
				});
			if (guildDB.isPremium === 'true') s = [""];

			//Generate a random number between 1 to 10;
			const randomNumber = Math.floor(Math.random() * 50);
			content = randomNumber == 0 ? (content ?? '') + s[0] : randomNumber == 1 ? (content ?? '') + s[1] : content;
			if (type && type.toLowerCase() == 'editreply' && ctx.replied) {
				const c = await ctx
					.editReply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();

				return c.message!;
			} else if (type && type.toLowerCase() == 'editreply') {
				const c = await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
				return c.message!;
			} else if (type && type.toLowerCase() == 'reply') {
				const c = await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
				return c.message!;
			} else if (type && type.toLowerCase() == 'ephemeral') {
				const c = await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
						ephemeral: true,
						private: true,
					})
					.catch();
				return c.message!;
			} else if (type && type.toLowerCase() == 'ephemeraledit') {
				const c = await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
						ephemeral: true,
						private: true,
					})
					.catch();
				return c.message!;
			} else {
				const c = await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
				return c.message!;
			}
		} else {
			return await client.helpers
				.sendMessage(ctx.id, {
					embeds: embeds,
					content: content,
					components: components,
				})
				.catch();
		}
	};

	//Return all the functions
	return {
		templateEmbed,
		errNormal,
		errUsage,
		errWait,
		embed,
		simpleEmbed,
		simpleMessageEmbed,
		editEmbed,
		sendEmbedMessage,
		sendEmbed,
		succNormal,
	};
};
