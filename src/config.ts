import { config } from 'dotenv';
config();

export const configs = {
  '931226824753700934': {
    TOKEN: process.env.DISCORD_TOKEN1,
    PREFIX: process.env.BOTPREFIX,
    Disabled: [],
  } as Config,
  exampleBotId: {
    TOKEN: 'BOTTOKEN',
    PREFIX: '!',
    Disabled: [],
  },
};

export type Config = {
  TOKEN: string;
  PREFIX: string;
  Disabled: string[];
};
