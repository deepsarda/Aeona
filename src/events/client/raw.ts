import { DiscordGatewayPayload } from 'discordeno';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, data: DiscordGatewayPayload, _shardId: number) => {
  //@ts-ignore
  client.extras.player.updateVoiceState(data);
};
