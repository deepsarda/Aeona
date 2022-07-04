const { Message, MessagePayload } = require("discord.js");
const resources = require("../utils/resources");
module.exports.run = () => {
  Message.prototype.reply = function (options) {
    if (!this.channel) return Promise.reject(new Error("CHANNEL_NOT_CACHED"));
    options.msg = this;
    options.member = this.member;
    options = resources.success.embed(options);
    let data;

    if (options instanceof MessagePayload) {
      data = options;
    } else {
      data = options;
      data.reply = {
        messageReference: this,
        failIfNotExists:
          options?.failIfNotExists ?? this.client.options.failIfNotExists,
      };
    }
    return this.channel.send(data);
  };

  Message.prototype.replyError = function (options) {
    if (!this.channel) return Promise.reject(new Error("CHANNEL_NOT_CACHED"));
    options.msg = this;
    options.member = this.member;
    options = resources.error.embed(options);
    let data;

    if (options instanceof MessagePayload) {
      data = options;
    } else {
      data = options;
      data.reply = {
        messageReference: this,
        failIfNotExists:
          options?.failIfNotExists ?? this.client.options.failIfNotExists,
      };
    }
    return this.channel.sendError(data);
  };

  Message.prototype.edit = function (options) {
    options = resources.success.embed(options);
    if (!this.channel) return Promise.reject(new Error("CHANNEL_NOT_CACHED"));
    return this.channel.messages.edit(this, options);
  };

  Message.prototype.editError = function (options) {
    options = resources.error.embed(options);
    if (!this.channel) return Promise.reject(new Error("CHANNEL_NOT_CACHED"));
    return this.channel.messages.edit(this, options);
  };
};
