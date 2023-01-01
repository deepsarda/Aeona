import { AmethystError, Context, ErrorEnums } from '@thereallonewolf/amethystframework';
import { Interaction, Message } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (
	bot: AeonaBot,
	data: {
		error: AmethystError;
		data?: Interaction;
		message?: Message;
	},
	context: Context,
) => {
	if (data.error.type == ErrorEnums.USER_MISSING_PERMISSIONS) {
		return await bot.helpers.sendMessage(data.message ? data.message.channelId : data.data?.channelId!, {
			content: 'Oh no. You seem to be missing some permissions.',
		});
	}
	if (data.error.type == ErrorEnums.MISSING_REQUIRED_ARGUMENTS) {
		if (!data.message) return;
		const message = data.message;
		const guildPrefix = typeof bot.prefix == 'function' ? await bot.prefix(bot, message) : bot.prefix;

		//Else get the string prefix and check if it works.
		let prefix =
			typeof guildPrefix == 'string'
				? guildPrefix
				: guildPrefix?.find((e) =>
						bot.prefixCaseSensitive
							? message.content.startsWith(e)
							: message.content.toLowerCase().startsWith(e.toLowerCase()),
				  );

		//If prefix is a string and not a array
		if (typeof prefix == 'string')
			if (bot.prefixCaseSensitive)
				if (!message.content.startsWith(prefix)) prefix = undefined;
				else if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) prefix = undefined;

		//If the bot.botMentionAsPrefix is a prefix.
		if (!prefix && bot.botMentionAsPrefix) {
			if (message.content.startsWith(`<@${bot.id}>`)) prefix = `<@${bot.id}>`;
			else if (message.content.startsWith(`<@!${bot.id}>`)) prefix = `<@!${bot.id}>`;
		}

		const args = message.content.split(' ').filter((e) => Boolean(e.length));
		const commandName = args.shift()?.slice(prefix?.length);
		const subCommandName = args.shift();
		let command;
		let category;
		for (let i = 0; i < bot.category.size; i++) {
			const data = bot.category.at(i)!.getCommand(commandName!, subCommandName);
			command = data.command;
			if (command) {
				if (bot.category.at(i)!.uniqueCommands || !data.usedSubCommand)
					if (subCommandName) args.unshift(subCommandName);
				category = bot.category.at(i);
				break;
			}
		}

		if (!command) return;

		return bot.extras.errUsage(
			{
				usage: `You need to specify some required arguments. \n [] means required. () means optional.\n \n\`${prefix}${
					category.uniqueCommands ? command.name : category.name + ' ' + command.name
				} ${command.args
					.map((arg) => {
						if (arg.required) return `[${arg.name}]`;
						else return `(${arg.name})`;
					})
					.join(' ')} \` \n \n  ${command.args
					.map((arg) => {
						return `**${arg.name}:-** \`Type: ${arg.type}\` Description: ${arg.description}`;
					})
					.join(`\n`)}`,
			},
			context,
		);
	}

	if (data.error.type == ErrorEnums.COOLDOWN)
		return await bot.extras.errWait(
			{
				time: 5,
			},
			context,
		);

	if (data.error.type == ErrorEnums.OWNER_ONLY)
		return await bot.extras.errNormal(
			{
				error: 'Oh no! This is only meant for my owner.',
			},
			context,
		);
	if (data.error.type == ErrorEnums.OTHER) {
		return await bot.extras.errNormal(
			{
				//@ts-ignore
				error: data.error.value,
			},
			context,
		);
	}

	if (data.error.type == ErrorEnums.COMMANDRUNTIME) {
		console.log(data);
	}
};
