import { DiscordHeader, DiscordMessages } from '@derockdev/discord-components-react';
import { Async } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import { Channel, ChannelTypes, Message, Role, User } from 'discordeno';
import { readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { scrollToMessage } from '../static/client.js';
import { buildProfiles } from '../utils/buildProfiles.js';
import renderContent, { RenderType } from './renderers/content.js';
import renderMessage from './renderers/message.js';

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.5.0';

try {
	const packagePath = path.join(__dirname, '..', '..', 'package.json');
	const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
	discordComponentsVersion = packageJSON.dependencies['@derockdev/discord-components-core'] ?? discordComponentsVersion;
	// eslint-disable-next-line no-empty
} catch {} // ignore errors

export type RenderMessageContext = {
	messages: Message[];
	channel: Channel;

	callbacks: {
		resolveChannel: (channelId: string) => Async<Channel | null>;
		resolveUser: (userId: string) => Async<User | null>;
		resolveRole: (roleId: string) => Async<Role | null>;
	};

	poweredBy?: boolean;
	saveImages: boolean;
	favicon: 'guild' | string;
};

export default async function renderMessages(
	bot: AeonaBot,
	{ messages, channel, callbacks, ...options }: RenderMessageContext,
) {
	const profiles = await buildProfiles(bot, messages);
	const chatBody: React.ReactElement[] = [];

	for (const message of messages) {
		const rendered = await renderMessage(bot, message, {
			messages,
			channel,
			callbacks,
			...options,
		});

		if (rendered) chatBody.push(rendered);
	}

	const elements = (
		<DiscordMessages style={{ minHeight: '100vh' }}>
			{/* header */}
			<DiscordHeader
				guild={
					channel.type == ChannelTypes.DM ? 'Direct Messages' : (await bot.cache.guilds.get(channel.guildId))!.name
				}
				channel={channel.type == ChannelTypes.DM ? 'Unknown Recipient' : channel.name}
				icon={
					channel.type == ChannelTypes.DM
						? undefined
						: bot.helpers.getGuildIconURL(channel.guildId, (await bot.cache.guilds.get(channel.guildId))!.icon, {
								size: 128,
						  }) ?? undefined
				}
			>
				{channel.type == ChannelTypes.PublicThread || channel.type == ChannelTypes.PrivateThread
					? `Thread channel in ${
							(await bot.cache.channels.get(channel.parentId!))
								? (await bot.cache.channels.get(channel.parentId!))?.name
								: 'Unknown Channel'
					  }`
					: channel.type == ChannelTypes.DM
					? `Direct Messages`
					: channel.type == ChannelTypes.GuildVoice || channel.type == ChannelTypes.GuildStageVoice
					? `Voice Text Channel for ${channel.name}`
					: channel.type === ChannelTypes.GuildCategory
					? `Category Channel`
					: 'topic' in channel && channel.topic
					? await renderContent(channel.topic, {
							messages,
							channel,
							callbacks,
							type: RenderType.REPLY,
							...options,
					  })
					: `This is the start of #${channel.name} channel.`}
			</DiscordHeader>

			{/* body */}
			{chatBody}

			{/* footer */}
			<div style={{ textAlign: 'center', width: '100%' }}>
				Exported {messages.length} message{messages.length > 1 ? 's' : ''}.{' '}
				{options.poweredBy ? (
					<span style={{ textAlign: 'center' }}>
						Powered by{' '}
						<a href="https://github.com/ItzDerock/discord-html-transcripts" style={{ color: 'lightblue' }}>
							discord-html-transcripts
						</a>
						.
					</span>
				) : null}
			</div>
		</DiscordMessages>
	);

	return ReactDOMServer.renderToStaticMarkup(
		<html>
			<head>
				<meta name="viewport" content="width=device-width" />

				{/* favicon */}
				<link
					rel="icon"
					type="image/png"
					href={
						options.favicon === 'guild'
							? channel.type == ChannelTypes.DM
								? undefined
								: bot.helpers.getGuildIconURL(channel.guildId, (await bot.cache.guilds.get(channel.guildId))!.icon, {
										size: 16,
										format: 'png',
								  }) ?? undefined
							: options.favicon
					}
				/>

				{/* title */}
				<title>{channel.type == ChannelTypes.DM ? 'Direct Messages' : channel.name}</title>

				{/* profiles */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.$discordMessage={profiles:${await profiles}}`,
					}}
				></script>

				{/* message reference handler */}
				<script
					dangerouslySetInnerHTML={{
						__html: scrollToMessage,
					}}
				/>

				{/* component library */}
				<script
					type="module"
					src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
				></script>
			</head>

			<body
				style={{
					margin: 0,
					minHeight: '100vh',
				}}
			>
				{elements}
			</body>
		</html>,
	);
}
