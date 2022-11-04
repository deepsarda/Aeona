import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno/transformers';

export default async (
	bot: AmethystBot,
	message:Message,
	commandName:string,
) => {
	
	await bot.helpers.sendMessage(message.channelId, {
		content: 'Oh no! I am unable to find your requested command!',
	});
};
