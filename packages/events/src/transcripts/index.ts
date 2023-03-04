import { Blob } from 'buffer';
import { Channel, ChannelTypes, Collection, Message } from 'discordeno';

import { AeonaBot } from '../extras/index.js';
import renderMessages from './generator/index.js';
import {
  CreateTranscriptOptions,
  ExportReturnType,
  GenerateFromMessagesOptions,
  ObjectType,
} from './types.js';

/**
 *
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<
  T extends ExportReturnType = ExportReturnType.Attachment,
>(
  bot: AeonaBot,
  messages: Message[] | Collection<string, Message>,
  channel: Channel,
  options: GenerateFromMessagesOptions<T> = {},
): Promise<ObjectType<T>> {
  // turn messages into an array
  const transformedMessages =
    messages instanceof Collection ? Array.from(messages.values()) : messages;

  // const startTime = process.hrtime();

  // render the messages
  const html = await renderMessages(bot, {
    messages: transformedMessages,
    channel,
    saveImages: options.saveImages ?? false,
    callbacks: {
      resolveChannel: async (id: any) =>
        (await bot.cache.channels.get(id).catch(() => null))!,
      resolveUser: async (id: any) => bot.helpers.getUser(id).catch(() => null),
      resolveRole:
        channel.type == ChannelTypes.DM
          ? () => null
          : async (id: any) =>
            (await bot.cache.guilds.get(channel.guildId))?.roles.get(id)!,

      ...(options.callbacks ?? {}),
    },
    poweredBy: options.poweredBy ?? true,
    favicon: options.favicon ?? 'guild',
  });

  // get the time it took to render the messages
  // const renderTime = process.hrtime(startTime);
  // console.log(`[discord-html-transcripts] Rendered ${transformedMessages.length} messages in ${renderTime[0]}s ${renderTime[1] / 1000000}ms`);

  // return the html in the specified format
  if (options.returnType === ExportReturnType.Buffer) {
    return Buffer.from(html) as unknown as ObjectType<T>;
  }

  if (options.returnType === ExportReturnType.String) {
    return html as unknown as ObjectType<T>;
  } const blob = new Blob([Buffer.from(html)], {
    type: 'text/html',
  });

  const buffer =
    await blob.arrayBuffer();

  return {
    blob: `data:${blob?.type
      };base64,${buffer.toString()}`,
    name: options.filename ?? `transcript-${channel.id}.html`,
  } as unknown as ObjectType<T>;
}

/**
 *
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<
  T extends ExportReturnType = ExportReturnType.Attachment,
>(
  bot: AeonaBot,
  channel: Channel,
  options: CreateTranscriptOptions<T> = {},
): Promise<ObjectType<T>> {
  // fetch messages
  let allMessages: Message[] = [];
  let lastMessageId: bigint | undefined;
  const { limit } = options;
  const resolvedLimit =
    typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

  // until there are no more messages, keep fetching
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // create fetch options
    const fetchLimitOptions = { limit: 100, before: lastMessageId };
    if (!lastMessageId) delete fetchLimitOptions.before;

    // fetch messages
    const messages = await bot.helpers.getMessages(
      `${channel.id}`,
      fetchLimitOptions,
    );

    // add the messages to the array
    allMessages.push(...messages.values());
    lastMessageId = messages.last()!.id;

    // if there are no more messages, break
    if (messages.size < 100) break;

    // if the limit has been reached, break
    if (allMessages.length >= resolvedLimit) break;
  }

  if (resolvedLimit < allMessages.length)
    allMessages = allMessages.slice(0, limit);

  // generate the transcript
  return generateFromMessages<T>(bot, allMessages.reverse(), channel, options);
}

export default {
  createTranscript,
  generateFromMessages,
};
export * from './types.js';
