import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Emoji, Member, User } from 'discordeno';
import StarBoard from '../../database/models/starboardChannels.js';

export default async (
	client: AmethystBot,
	payload: {
		userId: bigint;
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
		member?: Member;
		user?: User;
		emoji: Emoji;
	},
) => {
	if (payload.emoji.name === '⭐') {
		const data = await StarBoard.findOne({ Guild: payload.guildId });
		if (!data) return;

		const starboardChannel = await client.helpers.getChannel(data.Channel).catch();
		if (!starboardChannel) return;

		const fetch = await client.helpers.getMessages(starboardChannel.id, {
			limit: 100,
		});
		const stars = fetch.find((m) => {
			return m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.endsWith(payload.messageId + '')
				? true
				: false;
		});

		if (stars) {
			const message = await client.helpers.getMessage(payload.channelId, payload.messageId);
			const foundStar = stars.embeds[0];
			const image = message.attachments.length > 0 ? await extension(payload, message.attachments[0]?.url) : '';

			client.helpers.deleteMessage(starboardChannel.id, stars.id);

			client.extras.embed(
				{
					title: `Starboard`,
					desc: foundStar.description,
					image: image,
					fields: [
						{
							name: `→ Stars`,
							value: `${message.reactions?.find((r) => r.emoji.name == '⭐')?.count}`,
							inline: true,
						},
						{
							name: `→ Message`,
							value: `[Jump to the message](https://discord.com/channels/${payload.guildId}/${payload.channelId}/${payload.messageId})`,
							inline: true,
						},
						{
							name: `→ Author`,
							value: `<@${message.member?.id}> (${
								message.member?.user?.username + '#' + message.member?.user?.discriminator
							})`,
							inline: true,
						},
					],
					footer: `${client.extras.config.discord.footer} | ${payload.messageId}`,
				},
				starboardChannel,
			);
		}
		if (!stars) {
			const message = await client.helpers.getMessage(payload.channelId, payload.messageId);
			const image = message.attachments.length > 0 ? await extension(payload, message.attachments[0]?.url) : '';

			client.extras.embed(
				{
					title: `→ Starboard`,
					desc: message.content,
					image: image,
					fields: [
						{
							name: `→ Stars`,
							value: `${message.reactions?.find((r) => r.emoji.name == '⭐')?.count}`,
							inline: true,
						},
						{
							name: `→ Message`,
							value: `[Jump to the message](https://discord.com/channels/${payload.guildId}/${payload.channelId}/${payload.messageId})`,
							inline: true,
						},
						{
							name: `→ Author`,
							value: `<@${message.member?.id}> (${
								message.member?.user?.username + '#' + message.member?.user?.discriminator
							})`,
							inline: true,
						},
					],
					footer: `${client.extras.config.discord.footer} | ${payload.messageId}`,
				},
				starboardChannel,
			);
		}
	}
};

function extension(
	reaction: {
		userId: bigint;
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
		member?: Member;
		user?: User;
		emoji: Emoji;
	},
	attachment: string,
) {
	const imageLink = attachment.split('.');
	const typeOfImage = imageLink[imageLink.length - 1];
	const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
	if (!image) return '';
	return attachment;
}
