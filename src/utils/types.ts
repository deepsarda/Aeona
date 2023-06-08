import { ClusterClient } from "discord-hybrid-sharding";
import { Client } from "discordx";

export interface AeonaBot extends Client {
  cluster: ClusterClient<Client>;
}
