import { VoiceState } from '@discordeno/bot';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, state: VoiceState) => {
  if (!state.channelId) client.extras.voiceStates.delete(`${state.guildId}_${state.userId}`);
  else client.extras.voiceStates.set(`${state.guildId}_${state.userId}`, state);
};
