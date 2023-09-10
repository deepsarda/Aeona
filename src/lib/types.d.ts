declare module 'hmfull' {
  interface HMfullResults {
    url: string;
  }
  interface Nekos {
    sfw: {
      pat(): Promise<HMfullResults>;
      neko(): Promise<HMfullResults>;
      kiss(): Promise<HMfullResults>;
      hug(): Promise<HMfullResults>;
      feed(): Promise<HMfullResults>;
      cuddle(): Promise<HMfullResults>;
      smug(): Promise<HMfullResults>;
      tickle(): Promise<HMfullResults>;
      foxgirl(): Promise<HMfullResults>;
      waifu(): Promise<HMfullResults>;
    };
    nsfw: { nekogif(): Promise<HMfullResults>; wallpaper(): Promise<HMfullResults> };
  }
  interface NekoLove {
    sfw: {
      pat(): Promise<HMfullResults>;
      hug(): Promise<HMfullResults>;
      kiss(): Promise<HMfullResults>;
      cry(): Promise<HMfullResults>;
      slap(): Promise<HMfullResults>;
      smug(): Promise<HMfullResults>;
      punch(): Promise<HMfullResults>;
      neko(): Promise<HMfullResults>;
      kitsune(): Promise<HMfullResults>;
      waifu(): Promise<HMfullResults>;
    };
    nsfw: { nekolewd(): Promise<HMfullResults> };
  }
  interface NekoBot {
    sfw: {
      kanna(): Promise<HMfullResults>;
      neko(): Promise<HMfullResults>;
      holo(): Promise<HMfullResults>;
      kemonomimi(): Promise<HMfullResults>;
      coffee(): Promise<HMfullResults>;
      gah(): Promise<HMfullResults>;
    };
    nsfw: {
      hentai(): Promise<HMfullResults>;
      ass(): Promise<HMfullResults>;
      boobs(): Promise<HMfullResults>;
      paizuri(): Promise<HMfullResults>;
      yuri(): Promise<HMfullResults>;
      thigh(): Promise<HMfullResults>;
      lewdneko(): Promise<HMfullResults>;
      midriff(): Promise<HMfullResults>;
      kitsune(): Promise<HMfullResults>;
      tentacle(): Promise<HMfullResults>;
      anal(): Promise<HMfullResults>;
      hanal(): Promise<HMfullResults>;
      neko(): Promise<HMfullResults>;
    };
  }
  interface HMtai {
    sfw: {
      wave(): Promise<HMfullResults>;
      wink(): Promise<HMfullResults>;
      tea(): Promise<HMfullResults>;
      bonk(): Promise<HMfullResults>;
      punch(): Promise<HMfullResults>;
      poke(): Promise<HMfullResults>;
      bully(): Promise<HMfullResults>;
      pat(): Promise<HMfullResults>;
      kiss(): Promise<HMfullResults>;
      kick(): Promise<HMfullResults>;
      blush(): Promise<HMfullResults>;
      feed(): Promise<HMfullResults>;
      smug(): Promise<HMfullResults>;
      hug(): Promise<HMfullResults>;
      cuddle(): Promise<HMfullResults>;
      cry(): Promise<HMfullResults>;
      slap(): Promise<HMfullResults>;
      five(): Promise<HMfullResults>;
      glomp(): Promise<HMfullResults>;
      happy(): Promise<HMfullResults>;
      hold(): Promise<HMfullResults>;
      nom(): Promise<HMfullResults>;
      smile(): Promise<HMfullResults>;
      throw(): Promise<HMfullResults>;
      lick(): Promise<HMfullResults>;
      bite(): Promise<HMfullResults>;
      dance(): Promise<HMfullResults>;
      boop(): Promise<HMfullResults>;
      sleep(): Promise<HMfullResults>;
      like(): Promise<HMfullResults>;
      kill(): Promise<HMfullResults>;
      tickle(): Promise<HMfullResults>;
      nosebleed(): Promise<HMfullResults>;
      threaten(): Promise<HMfullResults>;
      depression(): Promise<HMfullResults>;
      wolf_arts(): Promise<HMfullResults>;
      jahy_arts(): Promise<HMfullResults>;
      neko_arts(): Promise<HMfullResults>;
      coffee_arts(): Promise<HMfullResults>;
      wallpaper(): Promise<HMfullResults>;
      mobileWallpaper(): Promise<HMfullResults>;
    };
    nsfw: {
      anal(): Promise<HMfullResults>;
      ass(): Promise<HMfullResults>;
      bdsm(): Promise<HMfullResults>;
      cum(): Promise<HMfullResults>;
      classic(): Promise<HMfullResults>;
      creampie(): Promise<HMfullResults>;
      manga(): Promise<HMfullResults>;
      femdom(): Promise<HMfullResults>;
      hentai(): Promise<HMfullResults>;
      incest(): Promise<HMfullResults>;
      masturbation(): Promise<HMfullResults>;
      public(): Promise<HMfullResults>;
      ero(): Promise<HMfullResults>;
      orgy(): Promise<HMfullResults>;
      elves(): Promise<HMfullResults>;
      yuri(): Promise<HMfullResults>;
      pantsu(): Promise<HMfullResults>;
      glasses(): Promise<HMfullResults>;
      cuckold(): Promise<HMfullResults>;
      blowjob(): Promise<HMfullResults>;
      boobjob(): Promise<HMfullResults>;
      footjoob(): Promise<HMfullResults>;
      handjoob(): Promise<HMfullResults>;
      boobs(): Promise<HMfullResults>;
      thighs(): Promise<HMfullResults>;
      pussy(): Promise<HMfullResults>;
      ahegao(): Promise<HMfullResults>;
      gangbang(): Promise<HMfullResults>;
      tentacles(): Promise<HMfullResults>;
      uniform(): Promise<HMfullResults>;
      gif(): Promise<HMfullResults>;
      nsfwNeko(): Promise<HMfullResults>;
      nsfwMobileWallpaper(): Promise<HMfullResults>;
      zettaiRyouiki(): Promise<HMfullResults>;
    };
  }
  const Manual: 'Example For All Libraries: await HMfull.HMtai.sfw.wallpaper() - { url: "link" }';
  const HMtai: HMtai;
  const Nekos: Nekos;
  const NekoLove: NekoLove;
  const NekoBot: NekoBot;
}

declare module 'discord-gamecord' {
  export interface TwoZeroFourEightConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    emojis?: {
      up?: string;
      down?: string;
      left?: string;
      right?: string;
    };
    timeoutTime?: number;
    buttonStyle?: ButtonStyle;
  }

  export class TwoZeroFourEight<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<TwoZeroFourEightConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    gameBoard: string[];
    mergedPos: Position[];
    length: number;
    score: number;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; score: number }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: TwoZeroFourEightConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    getBoardImage(): Promise<AttachmentBuilder>; // There is literally no reason to make this asynchronous
    startGame(): Promise<void>;
    placeRandomTile(): void;
    handleButtons(msg: Message): void;
    gameOver(msg: Message): Promise<Message>;
    isGameOver(): boolean;
    shiftVertical(dir: 'up' | 'down'): boolean;
    shiftHorizontal(dir: 'left' | 'right'): boolean;
    isInsideBlock(pos: Position): boolean;
    shift(pos: Position, dir: 'up' | 'down' | 'left' | 'right'): boolean;
  }

  export interface ApproveConstructorOptions {
    embed?: {
      requestTitle?: string;
      requestColor?: string;
      rejectTitle?: string;
      rejectColor?: string;
    };
    buttons?: {
      accept?: string;
      reject?: string;
    };
    reqTimeoutTime?: number;
    mentionUser?: boolean;
    requestMessage?: string;
    rejectMessage?: string;
    reqTimeoutMessage?: string;
  }

  export class Approve extends EventEmitter {
    options: DeepRequired<ApproveConstructorOptions>;
    message: MessageType<boolean>;
    opponent: User;

    constructor(options: ApproveConstructorOptions);
    approve(): Promise<Message | false>;
    formatTurnMessage<Options extends object>(options: Options, contentMsg: keyof Options): string;
  }

  export type DeepRequired<T> = T extends object ? { [K in keyof T]-?: DeepRequired<T[K]> } : T;
  export type Tuple<N extends number, T> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
  type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

  export type ButtonStyle = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER';

  export interface Position {
    x: number;
    y: number;
  }

  export type MessageType<IsSlashGame extends boolean> = IsSlashGame extends true
    ? ChatInputCommandInteraction
    : Message;

  export interface BaseConstructorOptions<IsSlashGame extends boolean> {
    isSlashGame?: IsSlashGame;
    message: MessageType<IsSlashGame>;
    playerOnlyMessage: string | false; // Wouldn't string | null be more natural?
  }

  export interface Connect4ConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    opponent: User;
    embed?: {
      title?: string;
      statusTitle?: string;
      color?: string;
    };
    emojis?: {
      board?: string;
      player1?: string;
      player2?: string;
    };
    timeoutTime?: number;
    buttonStyle?: ButtonStyle;
    turnMessage?: string;
    winMessage?: string;
    tieMessage?: string;
    timeoutMessage?: string;
    requestMessage?: string;
    rejectMessage?: string;
  }

  export class Connect4<IsSlashGame extends boolean = false> extends Approve {
    options: DeepRequired<ApproveConstructorOptions & Connect4ConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    opponent: User;
    player1Turn: boolean;
    gameBoard: string[];

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'tie' | 'timeout'; player: User; opponent: User }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: ApproveConstructorOptions & Connect4ConstructorOptions<IsSlashGame>);

    getBoardContent(): string;
    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    connect4Game(msg: Message): Promise<void>;
    handleButtons(msg: Message): void;
    gameOver(msg: Message, result: 'win' | 'tie' | 'timeout'): Promise<Message>;
    getPlayerEmoji(): string;
    getTurnMessage(msg?: string): string;
    isBoardFull(): boolean;
    foundCheck(blockX: number, blockY: number): boolean;
  }
  export interface Connect4ConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    opponent: User;

    embed?: {
      title?: string;

      statusTitle?: string;

      color?: string;
    };

    emojis?: {
      board?: string;

      player1?: string;

      player2?: string;
    };

    timeoutTime?: number;

    buttonStyle?: ButtonStyle;

    turnMessage?: string;

    winMessage?: string;

    tieMessage?: string;

    timeoutMessage?: string;

    requestMessage?: string;

    rejectMessage?: string;
  }

  export class Connect4<IsSlashGame extends boolean = false> extends Approve {
    options: DeepRequired<ApproveConstructorOptions & Connect4ConstructorOptions<IsSlashGame>>;

    message: MessageType<IsSlashGame>;

    opponent: User;

    player1Turn: boolean;

    gameBoard: string[];

    on(
      eventName: 'gameOver',

      listener: (result: { result: 'win' | 'tie' | 'timeout'; player: User; opponent: User }) => void,
    ): this;

    once(...args: Parameters<this['on']>): this;

    constructor(options: ApproveConstructorOptions & Connect4ConstructorOptions<IsSlashGame>);

    getBoardContent(): string;

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;

    startGame(): Promise<void>;

    connect4Game(msg: Message): Promise<void>;

    handleButtons(msg: Message): void;

    gameOver(msg: Message, result: 'win' | 'tie' | 'timeout'): Promise<Message>;

    getPlayerEmoji(): string;

    getTurnMessage(msg?: string): string;

    isBoardFull(): boolean;

    foundCheck(blockX: number, blockY: number): boolean;
  }
  export interface FastTypeConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
      description?: string;
    };
    sentence?: string;
    timeoutTime?: number;
    winMessage?: string;
    loseMessage?: string;
  }

  export class FastType<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<FastTypeConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    timeTaken: number | null;
    wpm: number;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; timeTaken: number; wpm: number }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: FastTypeConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
  }

  export interface FindEmojiConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
      description?: string;
      findDescription?: string;
    };
    timeoutTime?: number;
    hideEmojiTime?: number;
    buttonStyle?: ButtonStyle;
    emojis?: string[];
    winMessage?: string;
    loseMessage?: string;
    timeoutMessage?: string;
  }

  export class FindEmoji<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<FindEmojiConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    emojis: string[];
    selected: string | null;
    emoji: string | null;

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'lose' | 'timeout';
        player: User;
        selectedEmoji: string | null;
        correctEmoji: string | null;
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: FindEmojiConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    getComponents(showEmoji: boolean): ActionRowBuilder<ButtonBuilder>[];
  }

  export interface Fish {
    emoji: string;
    price: number;
  }

  export type Fishes = Record<'junk' | 'common' | 'uncommon' | 'rare', Fish>;

  // XXX: Someone suggest a better name, this name has a lot of ambiguity
  export interface Player {
    id: Snowflake;
    balance: number;
    fishes: object;
  }

  export interface FishyConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    player?: Partial<Player>;
    fishes?: Partial<Fishes>;
    fishyRodPrice?: number;
    catchMessage?: string;
    sellMessage?: string;
    noBalanceMessage?: string;
    invalidTypeMessage?: string;
    invalidAmountMessage?: string;
    noItemMesaage?: string;
  }

  export class Fishy<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<FishyConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    player: Player;
    fishes: Fishes;

    on(
      eventName: 'catchFish' | 'sellFish',
      listener: (fishy: { player: User; fishType: keyof Fishes; fish: Fish }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: FishyConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    catchFish(): Promise<Message>;
    sellFish(type: string, amount: number): Promise<Message>;
    fishyInventory(): Promise<Message>;
  }

  export interface FloodConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    difficulty?: number;
    timeoutTime?: number;
    buttonStyle?: ButtonStyle;
    winMessage?: string;
    loseMessage?: string;
    emojis?: string[];
  }

  export class Flood<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<FloodConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    length: number;
    gameBoard: string[];
    maxTurns: number;
    turns: number;

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'lose';
        player: User;
        turns: number;
        maxTurns: number;
        boardColor: string;
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: FloodConstructorOptions<IsSlashGame>);

    getBoardContent(): string;
    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    updateGame(selected: string, msg: Message): Promise<boolean | undefined>;
  }

  export interface Pokemon {
    name: string;
    id: number;
    types: string[];
    abilities: string[];
    height: number;
    width: number;
    answerImage: string;
    questionImage: string;
  }

  export interface GuessThePokemonConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    timeoutTime?: number;
    winMessage?: string;
    loseMessage?: string;
    errMessage?: string;
  }

  export class GuessThePokemon<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<GuessThePokemonConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    pokemon: Pokemon;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; pokemon: Pokemon }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: GuessThePokemonConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
  }

  // I am bad at naming
  export interface HangmanBody {
    hat?: string;
    head?: string;
    shirt?: string;
    pants?: string;
    boots?: string;
  }

  export interface HangmanConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: { title?: string; color?: string };
    hangman?: HangmanBody;
    customWord?: string | null;
    timeoutTime?: number;
    theme?: string;
    winMessage?: string;
    loseMessage?: string;
  }

  export class Hangman<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<HangmanConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    hangman: HangmanBody;
    word: string | null;
    buttonPage: number;
    guessed: string[];
    damage: number;

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'lose';
        player: User;
        word: string | null;
        damage: number;
        guessed: string[];
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: HangmanConstructorOptions<IsSlashGame>);

    getBoardContent(): string;
    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    handleButtons(msg: Message): void;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    foundWord(): boolean;
    getWordEmojis(): string;
    getComponent(page: number): ActionRowBuilder<ButtonBuilder>;
  }

  export interface MatchPairsConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: { title?: string; color?: string; description?: string };
    timeoutTime?: number;
    emojis?: string[];
    winMessage?: string;
    loseMessage?: string;
  }

  export class MatchPairs<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<MatchPairsConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    emojis: string[];
    remainingPairs: number;
    components: ActionRowBuilder<ButtonBuilder>;
    selected: (Position & { id: number }) | null;
    tilesTurned: number;
    length: number;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; tilesTurned: number; remainingPairs: number }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: MatchPairsConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    getPairEmoji(emoji: string): (Position & { id: number })[];
    getComponent(): ActionRowBuilder<ButtonBuilder>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    handleButtons(msg: Message): Promise<void>;
  }

  export interface MinesweeperConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
      description?: string;
    };
    emojis?: {
      flag?: string;
      mine?: string;
    };
    mines?: number;
    timeoutTime?: number;
    winMessage?: string;
    loseMessage?: string;
  }

  export class Minesweeper<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<MinesweeperConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    emojis: { flag: string; mine: string };
    gameBoard: (number | boolean)[];
    length: number;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; blocksTurned: number }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: MinesweeperConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    handleButtons(msg: Message): void;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    plantMines(): void;
    getMinesAround(x: number, y: number): number;
    showFirstBlock(): void;
    foundAllMines(): boolean;
    getComponents(showMines: boolean, found: boolean): ActionRowBuilder<ButtonBuilder>[];
  }

  export interface RockPaperScisdorsConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    opponent: User;
    embed?: {
      title?: string;
      color?: string;
      description?: string;
    };
    buttons: {
      rock?: string;
      paper?: string;
      scissors?: string;
    };
    emojis?: {
      rock?: string;
      paper?: string;
      scissors?: string;
    };
    timeoutTime?: number;
    buttonStyle?: ButtonStyle;
    pickMessage?: string;
    winMessage?: string;
    tieMessage?: string;
    timeoutMessage?: string;
    requestMessage?: string;
    rejectMessage?: string;
  }

  export class RockPaperScissors<IsSlashGame extends boolean = false> extends Approve {
    options: DeepRequired<ApproveConstructorOptions & RockPaperScisdorsConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    opponent: User;
    playerPick: string | null;
    opponentPick: string | null;

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'tie' | 'timeout';
        player: User;
        opponent: User;
        playerPick: string | null;
        opponentPick: string | null;
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: ApproveConstructorOptions & RockPaperScisdorsConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    RPSGame(msg: Message): Promise<void>;
    getResult(): 'win' | 'tie' | 'timeout';
    player1Won(): boolean;
    gameOver(msg: Message, result: 'win' | 'tie' | 'timeout'): Promise<Message>;
  }

  export interface SlotsConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    slots: string[];
  }

  export class Slots<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<SlotsConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    slot1: number;
    slot2: number;
    slot3: number;
    slots: string[];
    result: null;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; slots: [string, string, string] }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: SlotsConstructorOptions<IsSlashGame>);

    getBoardContent(showResult: boolean): string;
    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message): Promise<Message>;
    slotMachine(): void;
    hasWon(): boolean;
    wrap(s: number, add: boolean): string;
  }

  export interface SnakeConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
      overTitle?: string;
    };
    snake?: {
      head?: string;
      body?: string;
      tail?: string;
      skull?: string;
    };
    emojis?: {
      board?: string;
      food?: string;

      up?: string;
      down?: string;
      left?: string;
      right?: string;
    };
    foods?: string[];
    stopButton?: string;
    timeoutTime?: number;
  }

  export class Snake<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<SnakeConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    snake: Position[];
    apple: Position;
    snakeLength: number;
    gameBoard: string[];
    score: number;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; score: number }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: SnakeConstructorOptions<IsSlashGame>);

    getBoardContent(isSkull: boolean): string;
    isSnake(pos: Position): Position | false; // I think this should be boolean type in the src
    updateFoodLoc(): void;
    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    updateGame(msg: Message): Promise<Message>;
    gameOver(msg: Message): Promise<Message>;
    handleButtons(msg: Message): void;
  }

  export type TicTacToeGameCellState = 0 | 1 | 2;

  export interface TicTacToeConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    opponent: User;
    embed?: {
      title?: string;
      statusTitle?: string;
      overTitle?: string;
      color?: string;
    };
    emojis?: {
      xButton?: string;
      oButton?: string;
      blankButton?: string;
    };
    timeoutTime?: number;
    xButtonStyle?: ButtonStyle;
    oButtonStyle?: ButtonStyle;
    turnMessage?: string;
    winMessage?: string;
    tieMessage?: string;
    timeoutMessage?: string;
    requestMessage?: string;
    rejectMessage?: string;
  }

  export class TicTacToe<IsSlashGame extends boolean = false> extends Approve {
    options: DeepRequired<ApproveConstructorOptions & TicTacToeConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    opponent: User;
    gameBoard: Tuple<9, TicTacToeGameCellState>;
    player1Turn: boolean;

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'tie' | 'timeout';
        player: User;
        opponent: User;
        gameBoard: TicTacToe['gameBoard'];
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: ApproveConstructorOptions & TicTacToeConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    TicTacToeGame(msg: Message): Promise<void>;
    handleButtons(msg: Message): void;
    gameOver(msg: Message, result: 'win' | 'tie' | 'timeout'): Promise<Message>;
    isGameOver(): boolean;
    hasWonGame(player: 1 | 2): boolean;
    getPlayerEmoji(): string;
    getTurnMessage(msg?: string): string;
    // The functiom argument name 'btn' should be changed to 'state' or something like this
    getButton(btn: TicTacToeGameCellState): { emoji: string; style: ButtonStyle };
    getComponents(): ActionRowBuilder<ButtonBuilder>[];
  }

  export interface TriviaConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
      description?: string;
    };
    mode?: 'single' | 'multiple';
    timeoutTime?: number;
    buttonStyle?: ButtonStyle;
    trueButtonStyle?: ButtonStyle;
    falseButtonStyle?: ButtonStyle;
    difficulty: 'easy' | 'medium' | 'hard';
    winMessage?: string;
    loseMessage?: string;
    errMessage?: string;
  }

  export class Trivia<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<TriviaConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    selected: string | number | null;
    trivia:
      | {}
      | {
          question: string;
          difficulty: string;
          category: string;
          answer: string;
          options: string[];
        };

    on(
      eventName: 'gameOver',
      listener: (result: {
        result: 'win' | 'lose';
        player: User;
        question: Trivia['trivia'];
        selected: string | number | null;
      }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: TriviaConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: boolean): Promise<Message>;
    getComponents(gameOver: boolean): [ActionRowBuilder<ButtonBuilder>];
    getTriviaQuestion(): Promise<false | undefined>;
  }

  export interface WordleConstructorOptions<IsSlashGame extends boolean> extends BaseConstructorOptions<IsSlashGame> {
    embed?: { title?: string; color?: string };
    customWord?: string | null;
    timeoutTime?: number;
    winMessage?: string;
    loseMessage?: string;
  }

  export class Wordle<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<WordleConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    word: string | null;
    guessed: string[];

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'win' | 'lose'; player: User; word: string | null; guessed: string[] }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: WordleConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    getBoardImage(): Promise<AttachmentBuilder>; // There is no reason to make this asynchronous
    startGame(): Promise<void>;
    gameOver(msg: Message): Promise<Message>;
  }

  export interface WouldYouRatherConstructorOptions<IsSlashGame extends boolean>
    extends BaseConstructorOptions<IsSlashGame> {
    embed?: {
      title?: string;
      color?: string;
    };
    buttons?: {
      option1?: string;
      option2?: string;
    };
    errMessage?: string;
    buttonStyle?: ButtonStyle;
  }

  export interface WouldYouRatherData {
    title: string;
    author: string;
    option1: string;
    option2: string;
    option1_votes: string;
    option2_votes: string;
  }

  export class WouldYouRather<IsSlashGame extends boolean = false> extends EventEmitter {
    options: DeepRequired<WouldYouRatherConstructorOptions<IsSlashGame>>;
    message: MessageType<IsSlashGame>;
    data: WouldYouRatherData | {} | null;

    on(
      eventName: 'gameOver',
      listener: (result: { result: 'finish'; player: User; question: WouldYouRatherData; selected: string }) => void,
    ): this;
    once(...args: Parameters<this['on']>): this;

    constructor(options: WouldYouRatherConstructorOptions<IsSlashGame>);

    sendMessage(
      content: string | MessagePayload | (IsSlashGame extends true ? InteractionEditReplyOptions : MessageEditOptions),
    ): Promise<Message>;
    getWyrQuestion(): Promise<WouldYouRather | {}>;
    startGame(): Promise<void>;
    gameOver(msg: Message, result: '1' | '2'): Promise<Message>;
  }
}
declare module 'leo-profanity' {
  export function loadDictionary(lang: 'en' | 'fr'): void;
  export function list(): string[];
  export function check(text: string): boolean;
  export function clean(text: string, replaceKey?: string): string;
  export function add(word: string | string[]): void;
  export function remove(word: string | string[]): void;
  export function reset(): void;
  export function clearList(): void;
}
