const TextBasedChannel = require("discord.js/src/structures/interfaces/TextBasedChannel.js");
const { User, GuildMember } = require("discord.js");
const resources = require("../utils/resources");
module.exports.run = () => {
  TextBasedChannel.prototype.send = async function (options) {
    if (!options.resources) options = resources.success.embed(options);

    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };

  TextBasedChannel.prototype.sendError = async function (options) {
    if (!options.resources) options = resources.error.embed(options);
    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };

  GuildMember.prototype.send = async function (options) {
    if (!options.resources) options = resources.success.embed(options);

    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };

  GuildMember.prototype.sendError = async function (options) {
    if (!options.resources) options = resources.error.embed(options);
    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };

  User.prototype.send = async function (options) {
    if (!options.resources) options = resources.success.embed(options);

    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };

  User.prototype.sendError = async function (options) {
    if (!options.resources) options = resources.error.embed(options);
    if (this instanceof User || this instanceof GuildMember) {
      const dm = await this.createDM();

      return dm.send(options);
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.channels[this.id].messages.post({
      data,
      files,
    });

    return this.messages.cache.get(d.id) ?? this.messages._add(d);
  };
};
