import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import figlet from 'figlet';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { GuildMember, User } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('fun'))
@Category('fun')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Fun {
  @SimpleCommand({
    name: '8ball',
    description: 'Ask the all knowing 8ball a question. 🤔',
  })
  async ball(
    @SimpleCommandOption({
      name: 'question',
      description: 'The question to ask.',
      type: SimpleCommandOptionType.String,
    })
    question: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!question)
      return bot.extras.errUsage(
        {
          usage: '+8ball <question>',
        },
        command,
      );

    const answers = [
      'Yes!',
      'Unfortunately not',
      'You are absolutely right!',
      'No, sorry.',
      'I agree',
      'No idea!',
      'I am not that smart ..',
      'My sources say no!',
      'It is certain',
      'You can rely on it',
      'Probably not',
      'Everything points to a no',
      'No doubt',
      'Absolutely',
      'I do not know',
    ];
    const result = Math.floor(Math.random() * answers.length);

    bot.extras.embed(
      {
        title: `8ball`,
        desc: `See the answer on your question!`,
        fields: [
          {
            name: `💬 Your Question`,
            value: `\`\`\`${question}\`\`\``,
            inline: false,
          },
          {
            name: `💬 Bot Answer`,
            value: `\`\`\`${answers[result]}\`\`\``,
            inline: false,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'ascii',
    description: 'Create fancy text with ASCII art 🖌️',
  })
  async ascii(
    @SimpleCommandOption({
      name: 'text',
      description: 'The text to use.',
      type: SimpleCommandOptionType.String,
    })
    text: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!text)
      return bot.extras.errUsage(
        {
          usage: '+ascii <text>',
        },
        command,
      );

    const art = figlet.textSync(text);

    bot.extras.embed(
      {
        title: `ASCII`,
        desc: `See the ASCII art!`,
        fields: [
          {
            name: `💬 Your Text`,
            value: `\`\`\`${text}\`\`\``,
            inline: false,
          },
          {
            name: `💬 ASCII Art`,
            value: `\`\`\`${art}\`\`\``,
            inline: false,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'birdfact',
    description: 'Get a random fact about birds 🦜',
  })
  async birdfact(command: SimpleCommandMessage) {
    fetch(`https://some-random-api.ml/facts/bird`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random bird fact 🦜`,
            desc: json.fact,
            type: 'reply',
          },
          command,
        );
      })
      .catch();
  }

  @SimpleCommand({
    name: 'catfact',
    description: 'Get a random fact about cats 🐱',
  })
  async catfact(command: SimpleCommandMessage) {
    fetch(`https://some-random-api.ml/facts/cat`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random cat fact 🐱`,
            desc: json.fact,
            type: 'reply',
          },
          command,
        );
      })
      .catch();
  }

  @SimpleCommand({
    name: 'cleverate',
    description: 'See how clever you are! 🤔',
    aliases: ['cleverrate'],
  })
  async cleverate(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user to rate.',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!user) user = command.message.author;

    bot.extras.embed(
      {
        title: `Clever Rate`,
        desc: `${user} is ${Math.ceil(Math.random() * 100)}% clever!`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'dogfact',
    description: 'Get a random fact about dogs 🐶',
  })
  async dogfact(command: SimpleCommandMessage) {
    fetch(`https://some-random-api.ml/facts/dog`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random dog fact 🐕`,
            desc: json.fact,
            type: 'reply',
          },
          command,
        );
      })
      .catch();
  }

  @SimpleCommand({
    name: 'epicgamerrate',
    description: 'See how much of a epic gamer you are! 😎',
  })
  async epicgamerrate(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user to rate.',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!user) user = command.message.author;

    bot.extras.embed(
      {
        title: `😎 Epic Gamer Rate`,
        desc: `${user} is ${Math.ceil(Math.random() * 100)}% epic gamer!`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'fact',
    description: 'Get a random fun fact. 📌',
  })
  async fact(command: SimpleCommandMessage) {
    fetch(`https://uselessfacts.jsph.pl/random.json?language=en`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random fact 📌`,
            desc: json.text,
            type: 'reply',
          },
          command,
        );
      })
      .catch();
  }

  @SimpleCommand({
    name: 'howgay',
    description: 'See how gay you are! 🎏',
  })
  async howgay(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user to rate.',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!user) user = command.message.author;

    bot.extras.embed(
      {
        title: `🎏 Gay Rate`,
        desc: `${user} is ${Math.ceil(Math.random() * 100)}% gay!`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'koalafact',
    description: 'Get a random fact about koalas 🐰',
  })
  async koalafact(command: SimpleCommandMessage) {
    fetch(`https://some-random-api.ml/facts/koala`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random koala fact 🐰`,
            desc: json.fact,
            type: 'reply',
          },
          command,
        );
      });
  }

  @SimpleCommand({
    name: 'pandafact',
    description: 'Get a random fact about pandas 🐼',
  })
  async pandafact(command: SimpleCommandMessage) {
    fetch(`https://some-random-api.ml/facts/panda`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        bot.extras.embed(
          {
            title: `Random panda fact 🐼`,
            desc: json.fact,
            type: 'reply',
          },
          command,
        );
      });
  }

  @SimpleCommand({
    name: 'reverse',
    description: 'Reverse some text! 🔨',
  })
  async reverse(
    @SimpleCommandOption({
      name: 'text',
      description: 'The text to reverse.',
      type: SimpleCommandOptionType.String,
    })
    text: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!text)
      return bot.extras.errUsage(
        {
          usage: '+reverse <text>',
        },
        command,
      );
    bot.extras.embed(
      {
        title: `🔨 Reverse`,
        desc: text.split('').reverse().join(''),
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'rickroll',
    description: 'Send the link to a rickroll video! 🎤',
  })
  async rickroll(command: SimpleCommandMessage) {
    bot.extras.embed(
      {
        title: `🎤 Rickroll`,
        desc: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'roast',
    description: 'Send a roast! 🤣',
  })
  async roast(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user to roast.',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!user) user = command.message.author;

    const roasts = [
      "I'd offer you some gum but your smiles got plenty of it.",
      'Your body fat is about as evenly distributed as wealth in the US economy.',
      "You're like dobby from harry potter, only people won't be sad when you die in the seventh book.",
      'You have the kinds of looks that make people talk about your personality.',
      'You look like the result of pressing random on the character creation menu.',
      'You look like the after picture of a meth ad.',
      "Even the shower doesn't want to see you naked.",
      'I bet you wear a nose ring because no one wants to put one on your finger.',
      'When the airforce needs extra landing space they should just rent out your forehead.',
      'If laughter is the best medicine, your face must be curing the world.',
      'Tt looks like your face caught fire and someone tried to put it out with a hammer.',
      'Your family tree must be a cactus because everyone on it is a prick.',
      "Save your breath - you're going to need it to blow up your date.",
      "You're proof evolution can go in reverse.",
      'When you were born, the doctor came out to the waiting room and said to your dad, "I\'m very sorry. We did everything we could. But he pulled through."',
      "I wasn't born with enough middle fingers to let you know how I feel about you.",
      "Mirrors can't talk, and lucky for you they can't laugh either.",
      'Your IQ is lower than the Mariana Trench.',
      "You're so annoying even the flies stay away from your stench.",
      "I'd give you a nasty look but you've already got one.",
      'Someday you will go far, and I hope you stay there.',
      "The zoo called. They're wondering how you got out of your cage.",
      'I was hoping for a battle of wits, but you appear to be unarmed.',
      "Brains aren't everything, in your case, they're nothing.",
      'We all sprang from apes, but you did not spring far enough.',
      'Even monkeys can go to space, so clearly you lack some potential.',
      "I'd help you succeed but you're incapable.",
      'Your hairline is built like a graph chart, positive and negative forces attract but the clippers and your hair repel.',
      "You have two parts of your brain, 'left' and 'right'. In the left side, there's nothing right. In the right side, there's nothing left.",
      'Is your ass jealous of the amount of shit that just came out of your mouth?',
      "You must have been born on a highway because that's where most accidents happen.",
      "You're so ugly, when your mom dropped you off at school she got a fine for littering.",
      "The only way you'll ever get laid is if you crawl up a chicken's ass and wait.",
      "I'm jealous of all the people that haven't met you!",
      "If I had a face like yours, I'd sue my parents.",
      "There's only one problem with your face. I can see it.",
      "Don't you love nature, despite what it did to you?",
      "Brains aren't everything. In your case they're nothing.",
      'Oh, what? Sorry. I was trying to imagine you with a personality.',
      'Hell is wallpapered with all your deleted selfies.',
      'You have the perfect face for radio.',
    ];

    bot.extras.embed(
      {
        title: `🤣 Roast`,
        desc: roasts[Math.floor(Math.random() * roasts.length)],
        type: 'reply',
      },
      command,
    );
  }
}
