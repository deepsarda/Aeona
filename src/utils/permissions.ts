import {
  BaseGuildTextChannel,
  CommandInteraction,
  Interaction,
  InteractionResponseType,
  Message,
  MessagePayload,
  Routes,
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

export default function () {}
