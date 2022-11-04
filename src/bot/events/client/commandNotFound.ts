import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno/transformers';

export default async (bot: AmethystBot, message: Message, commandName: string) => {
	console.log(commandName);
};
