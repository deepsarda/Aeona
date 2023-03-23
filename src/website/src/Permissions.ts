class BitField {
  static FLAGS = { CREATE_INSTANT_INVITE: 1n << 0n };
  static defaultBit = 0n;
  bitfield: bigint;
  constructor(bits = Permissions.defaultBit) {
    this.bitfield = Permissions.resolve(bits);
  }

  any(bit: bigint) {
    return (
      (this.bitfield & Permissions.resolve(bit)) !== Permissions.defaultBit
    );
  }

  equals(bit: bigint) {
    return this.bitfield === Permissions.resolve(bit);
  }

  has(bit: bigint) {
    bit = Permissions.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  missing(bits: bigint | undefined, ...hasParams: any[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return new Permissions(bits).remove(this).toArray(...hasParams);
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>}
   */
  freeze() {
    return Object.freeze(this);
  }

  add(...bits: any[]) {
    let total = Permissions.defaultBit;
    for (const bit of bits) {
      total |= Permissions.resolve(bit);
    }
    if (Object.isFrozen(this)) return new Permissions(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  remove(...bits: any[]) {
    let total = Permissions.defaultBit;
    for (const bit of bits) {
      total |= Permissions.resolve(bit);
    }
    if (Object.isFrozen(this)) return new Permissions(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  serialize(...hasParams: any[]) {
    const serialized = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    for (const [flag, bit] of Object.entries(Permissions.FLAGS)) {
      //@ts-ignore
      serialized[flag] = this.has(bit, ...hasParams);
    }
    return serialized;
  }

  toArray(...hasParams: any[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    return Object.keys(Permissions.FLAGS).filter((bit) =>
      //@ts-ignore
      this.has(bit, ...hasParams),
    );
  }

  toJSON() {
    return typeof this.bitfield === 'number'
      ? this.bitfield
      : this.bitfield.toString();
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }

  static resolve(bit: bigint): bigint {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return bit;

    if (Array.isArray(bit))
      return bit
        .map((p) => this.resolve(p))
        .reduce((prev, p) => prev | p, defaultBit);
    if (typeof bit === 'string') {
      if (typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit];
      if (!isNaN(bit)) return BigInt(bit);
    }
    throw new RangeError('BITFIELD_INVALID');
  }
}
class Permissions extends BitField {
  static override defaultBit = BigInt(0);
  static DEFAULT = BigInt(104324673);
  static override FLAGS = {
    CREATE_INSTANT_INVITE: 1n << 0n,
    KICK_MEMBERS: 1n << 1n,
    BAN_MEMBERS: 1n << 2n,
    ADMINISTRATOR: 1n << 3n,
    MANAGE_CHANNELS: 1n << 4n,
    MANAGE_GUILD: 1n << 5n,
    ADD_REACTIONS: 1n << 6n,
    VIEW_AUDIT_LOG: 1n << 7n,
    PRIORITY_SPEAKER: 1n << 8n,
    STREAM: 1n << 9n,
    VIEW_CHANNEL: 1n << 10n,
    SEND_MESSAGES: 1n << 11n,
    SEND_TTS_MESSAGES: 1n << 12n,
    MANAGE_MESSAGES: 1n << 13n,
    EMBED_LINKS: 1n << 14n,
    ATTACH_FILES: 1n << 15n,
    READ_MESSAGE_HISTORY: 1n << 16n,
    MENTION_EVERYONE: 1n << 17n,
    USE_EXTERNAL_EMOJIS: 1n << 18n,
    VIEW_GUILD_INSIGHTS: 1n << 19n,
    CONNECT: 1n << 20n,
    SPEAK: 1n << 21n,
    MUTE_MEMBERS: 1n << 22n,
    DEAFEN_MEMBERS: 1n << 23n,
    MOVE_MEMBERS: 1n << 24n,
    USE_VAD: 1n << 25n,
    CHANGE_NICKNAME: 1n << 26n,
    MANAGE_NICKNAMES: 1n << 27n,
    MANAGE_ROLES: 1n << 28n,
    MANAGE_WEBHOOKS: 1n << 29n,
    MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
    USE_APPLICATION_COMMANDS: 1n << 31n,
    REQUEST_TO_SPEAK: 1n << 32n,
    MANAGE_EVENTS: 1n << 33n,
    MANAGE_THREADS: 1n << 34n,
    // TODO: Remove deprecated USE_*_THREADS flags in v14
    USE_PUBLIC_THREADS: 1n << 35n,
    CREATE_PUBLIC_THREADS: 1n << 35n,
    USE_PRIVATE_THREADS: 1n << 36n,
    CREATE_PRIVATE_THREADS: 1n << 36n,
    USE_EXTERNAL_STICKERS: 1n << 37n,
    SEND_MESSAGES_IN_THREADS: 1n << 38n,
    START_EMBEDDED_ACTIVITIES: 1n << 39n,
    MODERATE_MEMBERS: 1n << 40n,
  };
  static ALL = Object.values(this.FLAGS).reduce((all, p) => all | p, 0n);
  static STAGE_MODERATOR =
    this.FLAGS.MANAGE_CHANNELS |
    this.FLAGS.MUTE_MEMBERS |
    this.FLAGS.MOVE_MEMBERS;

  override missing(bits: bigint, checkAdmin = true) {
    return checkAdmin && this.has(Permissions.FLAGS.ADMINISTRATOR)
      ? []
      : super.missing(bits);
  }

  override any(permission: any, checkAdmin = true) {
    return (
      (checkAdmin && super.has(Permissions.FLAGS.ADMINISTRATOR)) ||
      super.any(permission)
    );
  }

  override has(permission: any, checkAdmin = true) {
    return (
      (checkAdmin && super.has(Permissions.FLAGS.ADMINISTRATOR)) ||
      super.has(permission)
    );
  }

  override toArray() {
    return super.toArray(false);
  }
}

export default Permissions;
