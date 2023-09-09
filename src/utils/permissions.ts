import {
  BaseGuildTextChannel,
  CommandInteraction,
  Interaction,
  InteractionResponseType,
  Message,
  MessagePayload,
  Routes,
  resolvePartialEmoji,
} from 'discord.js';

BaseGuildTextChannel.prototype.send = async function (options) {
  if (!this.permissionsFor(this.guild.members.me ?? (await this.guild.members.fetchMe())).has('SendMessages'))
    return this.messages.cache.last()!;

  let messagePayload;

  if (options instanceof MessagePayload) {
    messagePayload = options.resolveBody();
  } else {
    //@ts-expect-error
    messagePayload = MessagePayload.create(this, options).resolveBody();
  }

  const { body, files } = await messagePayload.resolveFiles();
  if (body)
    //@ts-expect-error
    body.allowed_mentions = { parse: ['users', 'roles'], replied_user: true };

  //@ts-expect-error
  const d = await this.client.rest.post(Routes.channelMessages(this.id), { body, files });
  //@ts-expect-error
  return this.messages.cache.get(d.id) ?? this.messages._add(d);
};

CommandInteraction.prototype.reply = async function (options) {
  if (this.deferred && !this.replied) return await this.editReply(options);
  if (this.replied) return await this.followUp(options);

  //@ts-expect-error
  this.ephemeral = options.ephemeral ?? false;

  let messagePayload;
  if (options instanceof MessagePayload) messagePayload = options;
  else messagePayload = MessagePayload.create(this as unknown as Interaction, options);

  const { body: data, files } = await messagePayload.resolveBody().resolveFiles();

  await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data,
    },
    files: files ?? undefined,
    auth: false,
  });
  this.replied = true;
  //@ts-ignore
  return options.fetchReply ? this.fetchReply() : new InteractionResponse(this);
};
Message.prototype.react = async function (emoji) {
  try {
    await this.channel.messages.react(this.id, emoji);

    //@ts-expect-error
    return this.client.actions.MessageReactionAdd.handle(
      {
        //@ts-expect-error
        [this.client.actions.injectedUser]: this.client.user,
        //@ts-expect-error
        [this.client.actions.injectedChannel]: this.channel,
        //@ts-expect-error
        [this.client.actions.injectedMessage]: this,
        emoji: resolvePartialEmoji(emoji),
      },
      true,
    ).reaction;
  } catch (e) {
    throw e;
  }
};
export default function () {}
