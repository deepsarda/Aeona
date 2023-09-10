import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';

import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { GuildMember, User } from 'discord.js';
import GameCord from 'discord-gamecord';
@Discord()
@Bot(...getPluginsBot('games'))
@Category('games')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Games {
  @SimpleCommand({
    name: '2048',
    description: 'Play a game of 2048! 🔢',
  })
  async _2048(command: SimpleCommandMessage) {
    const Game = new GameCord.TwoZeroFourEight({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: '2048',
        color: '#5865F2',
      },
      emojis: {
        up: '⬆️',
        down: '⬇️',
        left: '⬅️',
        right: '➡️',
      },
      timeoutTime: 60000 * 10,
      buttonStyle: 'PRIMARY',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
    Game.on('gameOver', async (result) => {
      let u = await bot.extras.leaderboard.get('2048', result.player.id);
      if (!u || u.score < result.score) {
        await bot.extras.leaderboard.record('2048', {
          id: result.player.id,
          score: result.score,
        });

        let position = await bot.extras.leaderboard.position('2048', result.player.id);

        await bot.extras.embed(
          {
            desc: `You won! You ranked **${bot.extras.ordinalSuffix(position)}** in the leaderboard!`,
            fields: [
              {
                name: `${bot.config.emotes.normal.check} New High Score`,
                value: `${result.score}`,
              },
            ],
          },
          command,
        );
      } else {
        await bot.extras.embed(
          {
            desc: `You won! But you did not beat your previous score of **${
              u.score
            }** and ranked **${bot.extras.ordinalSuffix(
              await bot.extras.leaderboard.position('snake', result.player.id),
            )}** in the leaderboard!`,
            fields: [
              {
                name: `${bot.config.emotes.normal.check} Score`,
                value: `${result.score}`,
              },
              {
                name: `${bot.config.emotes.normal.check} High Score`,
                value: `${u.score}`,
              },
            ],
          },
          command,
        );
      }
    });
  }

  @SimpleCommand({
    name: 'connect4',
    description: 'Play a game of Connect 4! 🪙',
    aliases: ['c4', 'connect four'],
  })
  async connect4(
    @SimpleCommandOption({
      name: 'opponent',
      description: 'The opponent to play against.',
      type: SimpleCommandOptionType.User,
    })
    opponent: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!opponent)
      return bot.extras.errUsage(
        {
          usage: '+connect4 @user',
        },
        command,
      );
    const Game = new GameCord.Connect4({
      message: command.message,
      isSlashGame: false,
      opponent: opponent,
      embed: {
        title: 'Connect4 Game',
        statusTitle: 'Status',
        color: '#5865F2',
      },
      emojis: {
        board: '⚪',
        player1: '🔴',
        player2: '🟡',
      },
      mentionUser: true,
      timeoutTime: 60000 * 10,
      buttonStyle: 'PRIMARY',
      turnMessage: '{emoji} | Its turn of player **{player}**.',
      winMessage: '{emoji} | **{player}** won the Connect4 Game.',
      tieMessage: 'The Game tied! No one won the Game!',
      timeoutMessage: 'The Game went unfinished! No one won the Game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'fasttype',
    description: 'Type as fast as you can! ⌨️',
    aliases: ['fastype'],
  })
  async fasttype(command: SimpleCommandMessage) {
    const Game = new GameCord.FastType({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Fast Type',
        color: '#5865F2',
        description: 'You have {time} seconds to type the sentence below.',
      },
      timeoutTime: 60000 * 5,
      sentence: sentence(),
      winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
      loseMessage: "You lost! You didn't type the correct sentence in time.",
      playerOnlyMessage: 'Only {player}can use these buttons.',
    });

    Game.startGame();
    Game.on('gameOver', async (result) => {
      if (result.result == 'win') {
        let u = await bot.extras.leaderboard.get('fasttype', result.player.id);
        if (!u || u.score < result.wpm) {
          await bot.extras.leaderboard.record('fasttype', {
            id: result.player.id,
            score: result.wpm,
          });

          let position = await bot.extras.leaderboard.position('fasttype', result.player.id);

          await bot.extras.embed(
            {
              desc: `You won! You ranked **${bot.extras.ordinalSuffix(position)}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} New High Score`,
                  value: `${result.wpm}`,
                },
              ],
            },
            command,
          );
        } else {
          await bot.extras.embed(
            {
              desc: `You won! But you did not beat your previous score of **${
                u.score
              }** and ranked **${bot.extras.ordinalSuffix(
                await bot.extras.leaderboard.position('snake', result.player.id),
              )}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} Score`,
                  value: `${result.wpm}`,
                },
                {
                  name: `${bot.config.emotes.normal.check} High Score`,
                  value: `${u.score}`,
                },
              ],
            },
            command,
          );
        }
      }
    });
  }

  @SimpleCommand({
    name: 'findemoji',
    description: 'Find an emoji as fast as you can! 🍋',
  })
  async findemoji(command: SimpleCommandMessage) {
    const Game = new GameCord.FindEmoji({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Find Emoji',
        color: '#5865F2',
        description: 'Remember the emojis from the board below.',
        findDescription: 'Find the {emoji} emoji before the time runs out.',
      },
      timeoutTime: 60000 * 10,
      hideEmojiTime: 5000,
      buttonStyle: 'PRIMARY',
      emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
      winMessage: 'You won! You selected the correct emoji. {emoji}',
      loseMessage: 'You lost! You selected the wrong emoji. {emoji}',
      timeoutMessage: 'You lost! You ran out of time. The emoji is {emoji}',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'flood',
    description: 'Fight against a flood! 💥',
  })
  async flood(command: SimpleCommandMessage) {
    const Game = new GameCord.Flood({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Flood',
        color: '#5865F2',
      },
      difficulty: 13,
      timeoutTime: 60000 * 10,
      buttonStyle: 'PRIMARY',
      emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
      winMessage: 'You won! You took **{turns}** turns.',
      loseMessage: 'You lost! You took **{turns}** turns.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
    Game.on('gameOver', async (result) => {
      if (result.result == 'win') {
        let u = await bot.extras.leaderboard.get('flood', result.player.id);
        if (!u || u.score < 25 - result.turns) {
          await bot.extras.leaderboard.record('flood', {
            id: result.player.id,
            score: 25 - result.turns,
          });

          let position = await bot.extras.leaderboard.position('flood', result.player.id);

          await bot.extras.embed(
            {
              desc: `You won! You ranked **${bot.extras.ordinalSuffix(position)}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} New High Score`,
                  value: `${25 - result.turns}`,
                },
              ],
            },
            command,
          );
        } else {
          await bot.extras.embed(
            {
              desc: `You won! But you did not beat your previous score of **${
                u.score
              }** and ranked **${bot.extras.ordinalSuffix(
                await bot.extras.leaderboard.position('snake', result.player.id),
              )}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} Score`,
                  value: `${25 - result.turns}`,
                },
                {
                  name: `${bot.config.emotes.normal.check} High Score`,
                  value: `${u.score}`,
                },
              ],
            },
            command,
          );
        }
      }
    });
  }

  @SimpleCommand({
    name: 'guess-the-pokemon',
    description: 'Guess the pokemon! 🐾',
  })
  async guessThePokemon(command: SimpleCommandMessage) {
    const Game = new GameCord.GuessThePokemon({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: "Who's The Pokemon",
        color: '#5865F2',
      },
      timeoutTime: 60000 * 10,
      winMessage: 'You guessed it right! It was a {pokemon}.',
      loseMessage: 'Better luck next time! It was a {pokemon}.',
      errMessage: 'Unable to fetch pokemon data! Please try again.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'hangman',
    description: 'Play a game of Hangman! 🤔',
  })
  async hangman(command: SimpleCommandMessage) {
    let list = bot.extras.wordlist.filter((word) => word.length === 5);
    const Game = new GameCord.Hangman({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Hangman',
        color: '#5865F2',
      },
      hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
      customWord: list[Math.floor(Math.random() * list.length)],
      timeoutTime: 60000 * 10,
      theme: 'nature',
      winMessage: 'You won! The word was **{word}**.',
      loseMessage: 'You lost! The word was **{word}**.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'matchpairs',
    description: 'Match the pairs as fast as you can! 🧩',
  })
  async matchpairs(command: SimpleCommandMessage) {
    const Game = new GameCord.MatchPairs({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Match Pairs',
        color: '#5865F2',
        description: '**Click on the buttons to match emojis with their pairs.**',
      },
      timeoutTime: 60000 * 10,
      emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
      winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
      loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'minesweeper',
    description: 'Play a game of Minesweeper! 💣',
  })
  async minesweeper(command: SimpleCommandMessage) {
    const Game = new GameCord.Minesweeper({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Minesweeper',
        color: '#5865F2',
        description: 'Click on the buttons to reveal the blocks except mines.',
      },
      emojis: { flag: '🚩', mine: '💣' },
      mines: 10,
      timeoutTime: 60000 * 10,
      winMessage: 'You won the Game! You successfully avoided all the mines.',
      loseMessage: 'You lost the Game! Beaware of the mines next time.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
    Game.on('gameOver', async (result) => {
      if (result.result == 'win') {
        let u = await bot.extras.leaderboard.get('minesweeper', result.player.id);
        if (!u || u.score < result.blocksTurned) {
          await bot.extras.leaderboard.record('minesweeper', {
            id: result.player.id,
            score: result.blocksTurned,
          });

          let position = await bot.extras.leaderboard.position('minesweeper', result.player.id);

          await bot.extras.embed(
            {
              desc: `You won! You ranked **${bot.extras.ordinalSuffix(position)}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} New High Score`,
                  value: `${result.blocksTurned}`,
                },
              ],
            },
            command,
          );
        } else {
          await bot.extras.embed(
            {
              desc: `You won! But you did not beat your previous score of **${
                u.score
              }** and ranked **${bot.extras.ordinalSuffix(
                await bot.extras.leaderboard.position('minesweeper', result.player.id),
              )}** in the leaderboard!`,
              fields: [
                {
                  name: `${bot.config.emotes.normal.check} Score`,
                  value: `${result.blocksTurned}`,
                },
                {
                  name: `${bot.config.emotes.normal.check} High Score`,
                  value: `${u.score}`,
                },
              ],
            },
            command,
          );
        }
      }
    });
  }

  @SimpleCommand({
    name: 'rockpaperscissors',
    description: 'Play a game of Rock, Paper, Scissors! 🪨',
    aliases: ['rps'],
  })
  async rockpaperscissors(
    @SimpleCommandOption({
      name: 'opponent',
      description: 'The opponent to play against.',
      type: SimpleCommandOptionType.User,
    })
    opponent: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!opponent) {
      return bot.extras.errUsage(
        {
          usage: '+rps @user',
        },
        command,
      );
    }
    const Game = new GameCord.RockPaperScissors({
      message: command.message,
      isSlashGame: false,
      opponent: opponent,
      embed: {
        title: 'Rock Paper Scissors',
        color: '#5865F2',
        description: 'Press a button below to make a choice.',
      },
      buttons: {
        rock: 'Rock',
        paper: 'Paper',
        scissors: 'Scissors',
      },
      emojis: {
        rock: '🌑',
        paper: '📰',
        scissors: '✂️',
      },
      mentionUser: true,
      timeoutTime: 60000 * 10,
      buttonStyle: 'PRIMARY',
      pickMessage: 'You choose {emoji}.',
      winMessage: '**{player}** won the Game! Congratulations!',
      tieMessage: 'The Game tied! No one won the Game!',
      timeoutMessage: 'The Game went unfinished! No one won the Game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'slots',
    description: 'Play a game of slots! 🎰',
  })
  async slots(command: SimpleCommandMessage) {
    const Game = new GameCord.Slots({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Slot Machine',
        color: '#5865F2',
      },
      playerOnlyMessage: 'Only {player} can use these buttons.',
      slots: ['🍇', '🍊', '🍋', '🍌'],
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'snake',
    description: 'Play a game of snake! 🐍',
  })
  async snake(command: SimpleCommandMessage) {
    const Game = new GameCord.Snake({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Snake Game',
        overTitle: 'Game Over',
        color: '#5865F2',
      },
      emojis: {
        board: '⬛',
        food: '🍎',
        up: '⬆️',
        down: '⬇️',
        left: '⬅️',
        right: '➡️',
      },
      snake: { head: '🟢', body: '🟩', tail: '🟢', skull: '💀' },
      foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
      stopButton: 'Stop',
      timeoutTime: 60000 * 10,
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();

    Game.on('gameOver', async (result) => {
      let u = await bot.extras.leaderboard.get('snake', result.player.id);
      if (!u || u.score < result.score) {
        await bot.extras.leaderboard.record('snake', {
          id: result.player.id,
          score: result.score,
        });

        let position = await bot.extras.leaderboard.position('snake', result.player.id);

        await bot.extras.embed(
          {
            desc: `You won! You ranked **${bot.extras.ordinalSuffix(position)}** in the leaderboard!`,
            fields: [
              {
                name: `${bot.config.emotes.normal.check} New High Score`,
                value: `${result.score}`,
              },
            ],
          },
          command,
        );
      } else {
        await bot.extras.embed(
          {
            desc: `You won! But you did not beat your previous score of **${
              u.score
            }** and ranked **${bot.extras.ordinalSuffix(
              await bot.extras.leaderboard.position('snake', result.player.id),
            )}** in the leaderboard!`,
            fields: [
              {
                name: `${bot.config.emotes.normal.check} Score`,
                value: `${result.score}`,
              },
              {
                name: `${bot.config.emotes.normal.check} High Score`,
                value: `${u.score}`,
              },
            ],
          },
          command,
        );
      }
    });
  }

  @SimpleCommand({
    name: 'tictactoe',
    description: 'Play a game of tic-tac-toe! ⚾️',
  })
  async tictactoe(
    @SimpleCommandOption({
      name: 'opponent',
      description: 'The opponent to play against.',
      type: SimpleCommandOptionType.User,
    })
    opponent: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!opponent) {
      return bot.extras.errUsage(
        {
          usage: '+tictactoe @user',
        },
        command,
      );
    }
    const Game = new GameCord.TicTacToe({
      message: command.message,
      isSlashGame: false,
      opponent: opponent,
      embed: {
        title: 'Tic Tac Toe',
        color: '#5865F2',
        statusTitle: 'Status',
        overTitle: 'Game Over',
      },
      emojis: {
        xButton: '❌',
        oButton: '🔵',
        blankButton: '➖',
      },
      mentionUser: true,
      timeoutTime: 60000 * 10,
      xButtonStyle: 'DANGER',
      oButtonStyle: 'PRIMARY',
      turnMessage: '{emoji} | Its turn of player **{player}**.',
      winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
      tieMessage: 'The Game tied! No one won the Game!',
      timeoutMessage: 'The Game went unfinished! No one won the Game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'trivia',
    description: 'Play a game of trivia! ❔',
  })
  async trivia(command: SimpleCommandMessage) {
    const Game = new GameCord.Trivia({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Trivia',
        color: '#5865F2',
        description: 'You have 60 seconds to guess the answer.',
      },
      timeoutTime: 60000 * 10,
      buttonStyle: 'PRIMARY',
      trueButtonStyle: 'SUCCESS',
      falseButtonStyle: 'DANGER',
      mode: 'multiple', // multiple || single
      difficulty: 'medium', // easy || medium || hard
      winMessage: 'You won! The correct answer is {answer}.',
      loseMessage: 'You lost! The correct answer is {answer}.',
      errMessage: 'Unable to fetch question data! Please try again.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'wordle',
    description: 'Play a game of wordle! 🆎',
  })
  async wordle(command: SimpleCommandMessage) {
    let list = bot.extras.wordlist.filter((word) => word.length === 5);
    const Game = new GameCord.Wordle({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Wordle',
        color: '#5865F2',
      },
      customWord: list[Math.floor(Math.random() * list.length)],
      timeoutTime: 60000 * 10,
      winMessage: 'You won! The word was **{word}**.',
      loseMessage: 'You lost! The word was **{word}**.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }

  @SimpleCommand({
    name: 'wouldyourather',
    description: 'Play a game of Would You Rather? 🔖',
  })
  async wouldyourather(command: SimpleCommandMessage) {
    const Game = new GameCord.WouldYouRather({
      message: command.message,
      isSlashGame: false,
      embed: {
        title: 'Would You Rather',
        color: '#5865F2',
      },
      buttons: {
        option1: 'Option 1',
        option2: 'Option 2',
      },

      errMessage: 'Unable to fetch question data! Please try again.',
      playerOnlyMessage: 'Only {player} can use these buttons.',
    });

    Game.startGame();
  }
}

let nouns = ['bird', 'clock', 'boy', 'plastic', 'duck', 'teacher', 'old lady', 'professor', 'hamster', 'dog'];
let verbs = ['kicked', 'ran', 'flew', 'dodged', 'sliced', 'rolled', 'died', 'breathed', 'slept', 'killed'];
let adjectives = ['beautiful', 'lazy', 'professional', 'lovely', 'dumb', 'rough', 'soft', 'hot', 'vibrating', 'slimy'];
let adverbs = [
  'slowly',
  'elegantly',
  'precisely',
  'quickly',
  'sadly',
  'humbly',
  'proudly',
  'shockingly',
  'calmly',
  'passionately',
];
let preposition = ['down', 'into', 'up', 'on', 'upon', 'below', 'above', 'through', 'across', 'towards'];

function sentence() {
  let rand1 = Math.floor(Math.random() * 10);
  let rand2 = Math.floor(Math.random() * 10);
  let rand3 = Math.floor(Math.random() * 10);
  let rand4 = Math.floor(Math.random() * 10);
  let rand5 = Math.floor(Math.random() * 10);
  let rand6 = Math.floor(Math.random() * 10);

  let content =
    'The ' +
    adjectives[rand1] +
    ' ' +
    nouns[rand2] +
    ' ' +
    adverbs[rand3] +
    ' ' +
    verbs[rand4] +
    ' because some ' +
    nouns[rand1] +
    ' ' +
    adverbs[rand1] +
    ' ' +
    verbs[rand1] +
    ' ' +
    preposition[rand1] +
    ' a ' +
    adjectives[rand2] +
    ' ' +
    nouns[rand5] +
    ' which, became a ' +
    adjectives[rand3] +
    ', ' +
    adjectives[rand4] +
    ' ' +
    nouns[rand6] +
    '.';

  return content;
}
