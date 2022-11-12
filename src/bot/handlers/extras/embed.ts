import { AmethystBot, AmethystEmbed, Context } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import Schema from '../../database/models/functions.js';

export default (client: AmethystBot) => {
	client.extras.templateEmbed = function () {
		return new AmethystEmbed()

			.setColor(client.extras.config.colors.normal)
			.setFooter(client.extras.config.discord.footer, client.extras.config.discord.footerUrl)
			.setTimestamp();
	};

	//----------------------------------------------------------------//
	//                        ERROR MESSAGES                          //
	//----------------------------------------------------------------//

	// Normal error
	client.extras.errNormal = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			error: error,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.error} Error!`);
		embed.setDescription(`Something went wrong!`);
		embed.addField('→ Error comment', `\`\`\`${error}\`\`\``);
		embed.setColor(client.extras.config.colors.error);

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

	// Missing args
	client.extras.errUsage = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			usage: usage,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.error} Error!`);
		embed.setDescription(`You did not provide the correct arguments`);
		embed.addField('→ Required arguments', `\`\`\`${usage}\`\`\``);
		embed.setColor(client.extras.config.colors.error);

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

	// Missing perms

	client.extras.errMissingPerms = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			perms: perms,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.error} Error!`);
		embed.setDescription(`You don't have the right permissions`);
		embed.addField('→ Required Permission', `\`\`\`${perms}\`\`\``);
		embed.setColor(client.extras.config.colors.error);

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

	// No bot perms

	client.extras.errNoPerms = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			perms: perms,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.error} Error!`);
		embed.setDescription(`I don't have the right permissions`);
		embed.addField('→ Required Permission', `\`\`\`${perms}\`\`\``);
		embed.setColor(client.extras.config.colors.error);

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

	// Wait error

	client.extras.errWait = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			time: time,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.error} Error!`);
		embed.setDescription(`You've already done this once`);
		embed.addField('→ Try again on', `<t:${time}:f>`);
		embed.setColor(client.extras.config.colors.error);

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

	//----------------------------------------------------------------//
	//                        SUCCES MESSAGES                         //
	//----------------------------------------------------------------//

	// Normal succes
	client.extras.succNormal = async function (
		{
			embed: embed = client.extras.templateEmbed(),
			text: text,
			fields: fields,
			type: type,
			content: content,
			components: components,
		}: any,
		interaction: any,
	) {
		embed.setTitle(`${client.extras.emotes.normal.check} Success!`);
		embed.setDescription(`${text}`);
		embed.setColor(client.extras.config.colors.succes);

		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);

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

	//----------------------------------------------------------------//
	//                        BASIC MESSAGES                          //
	//----------------------------------------------------------------//

	// Default
	client.extras.embed = async function (
		{
			embed: embed = client.extras.templateEmbed(),
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
		}: any,
		interaction: { guild: { id: any } | undefined },
	) {
		if (interaction.guild == undefined) interaction.guild = { id: '0' };
		const functiondata = await Schema.findOne({ Guild: interaction.guild.id });

		if (title) embed.setTitle(title);
		if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + '...');
		else if (desc) embed.setDescription(desc);
		if (image) embed.setImage(image);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) for (const field of fields) embed.addField(field.name, field.value, field.inline);
		if (author) embed.setAuthor(author);
		if (url) embed.setURL(url);
		if (footer) embed.setFooter(footer);
		if (color) embed.setColor(color);
		if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color);

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

	client.extras.simpleEmbed = async function (
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
		}: any,
		interaction: { guildId: bigint },
	) {
		const functiondata = await Schema.findOne({ Guild: interaction.guildId });

		const embed = new AmethystEmbed().setColor(client.extras.config.colors.normal);

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

	client.extras.simpleMessageEmbed = async function (
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
		}: any,
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(client.extras.config.colors.normal);

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

	client.extras.editEmbed = async function (
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
		}: any,
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(client.extras.config.colors.normal);

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

	client.extras.sendEmbedMessage = async function (
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
		}: any,
		ctx: Message,
	) {
		const functiondata = await Schema.findOne({ Guild: ctx.guildId });

		const embed = new AmethystEmbed().setColor(client.extras.config.colors.normal);

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
	client.extras.sendEmbed = async function (
		{ embeds: embeds, content: content, components: components, type: type }: any,
		ctx: Context | { id: bigint },
	) {
		const s =['\n discord.gg/qURxRRHPwa','\n Upvote me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote'];
		//Generate a random number between 1 to 10;
		const randomNumber = Math.floor(Math.random() * 10);
		content=randomNumber==0?(content??"")+s[0]:randomNumber==1?(content??"")+s[1]:content;
		if (ctx instanceof Context) {
			if (type && type.toLowerCase() == 'editreply' && ctx.replied) {
				return await ctx
					.editReply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
			} else if (type && type.toLowerCase() == 'editreply') {
				return await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
			} else if (type && type.toLowerCase() == 'reply') {
				return await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
			} else if (type && type.toLowerCase() == 'ephemeral') {
				return await ctx
					.editReply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
						ephemeral: true,
					})
					.catch();
			} else if (type && type.toLowerCase() == 'ephemeraledit') {
				return await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
						ephemeral: true,
					})
					.catch();
			} else {
				return await ctx
					.reply({
						embeds: embeds,
						content: content,
						components: components,
						fetchReply: true,
					})
					.catch();
			}
		} else {
			return await client.helpers
				.sendMessage(ctx.id + '', {
					embeds: embeds,
					content: content,
					components: components,
				})
				.catch();
		}
	};
};
