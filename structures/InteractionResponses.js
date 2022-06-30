const { Interaction, MessagePayload } = require("discord.js");
const resources = require("../utils/resources");

module.exports.run = () => {
  Interaction.prototype.reply = async function (options) {
    if (this.deferred || this.replied)
      throw new Error("INTERACTION_ALREADY_REPLIED");
    this.ephemeral = options.ephemeral ?? false;

    if (!options.resources) options = resources.success.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  Interaction.prototype.replyError = async function (options) {
    if (this.deferred || this.replied)
      throw new Error("INTERACTION_ALREADY_REPLIED");
    this.ephemeral = options.ephemeral ?? false;
    if (!options.resources) options = resources.error.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  Interaction.prototype.edit = async function (options) {
    if (!this.deferred && !this.replied)
      throw new Error("INTERACTION_NOT_REPLIED");
    if (!options.resources) options = resources.success.embed(options);
    const message = await this.webhook.editMessage("@original", options);
    this.replied = true;
    return message;
  };

  Interaction.prototype.editError = async function (options) {
    if (!this.deferred && !this.replied)
      throw new Error("INTERACTION_NOT_REPLIED");
    if (!options.resources) options = resources.error.embed(options);
    const message = await this.webhook.editMessage("@original", options);
    this.replied = true;
    return message;
  };

  Interaction.prototype.followUp = function (options) {
    if (!this.deferred && !this.replied)
      return Promise.reject(new Error("INTERACTION_NOT_REPLIED"));
    if (!options.resources) options = resources.success.embed(options);
    return this.webhook.send(options);
  };

  Interaction.prototype.followUpError = function (options) {
    if (!this.deferred && !this.replied)
      return Promise.reject(new Error("INTERACTION_NOT_REPLIED"));
    if (!options.resources) options = resources.error.embed(options);
    return this.webhook.send(options);
  };

  Interaction.prototype.update = async function (options) {
    if (this.deferred || this.replied)
      throw new Error("INTERACTION_ALREADY_REPLIED");

    if (!options.resources) options = resources.success.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.UPDATE_MESSAGE,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };
};
