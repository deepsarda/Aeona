import { config } from "dotenv";
config();

export const configs = {
  "931226824753700934": {
    TOKEN: process.env.DISCORD_TOKEN1,
    PREFIX: process.env.BOTPREFIX,
    Disabled: [],
    website: {
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      port: 8080,
      url: "https://www.aeonabot.xyz",
      enabled: true,
    },
  } as Config,
  exampleBotId: {
    TOKEN: "BOTTOKEN",
    PREFIX: "!",
    Disabled: [],
    website: {
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      port: 25574,
      url: "https://www.aeona.xyz",
      enabled: false,
    },
  } as Config,
};

export type Config = {
  TOKEN: string;
  PREFIX: string;
  Disabled: string[];
  website: {
    CLIENT_SECRET: string;
    port: number;
    url: string;
    enabled: boolean;
  };
};
