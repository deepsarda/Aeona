import { ClusterClient } from "discord-hybrid-sharding";
import { HexColorString } from "discord.js";
import { Client } from "discordx";
import { additionalProps } from "./extras.js";

export interface AeonaBot extends Client {
  cluster: ClusterClient<Client>;
  config: BotConfig;
  extras: ReturnType<typeof additionalProps>;
}

export type BotConfig = {
  name: string;
  token: string;
  owners: string[];
  disabledPlugins: string[];
  colors: {
    normal: HexColorString;
    error: HexColorString;
  };
  emotes: {
    animated: {
      loading: string;
    };
    normal: {
      birthday: string;
      check: string;
      error: string;
    };
  };
  prefix: string;
};
