import { DiscordActionRow, DiscordButton } from '@derockdev/discord-components-react';
import { ActionRow, ButtonStyles, MessageComponentTypes, TextStyles } from 'discordeno';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils.js';

export default function renderComponentRow(row: ActionRow, id: number) {
  return (
    <DiscordActionRow key={id}>
      {row.components.map((component, id) => renderComponent(component, id))}
    </DiscordActionRow>
  );
}

const ButtonStyleMapping = {
  [ButtonStyles.Primary]: 'primary',
  [ButtonStyles.Secondary]: 'secondary',
  [ButtonStyles.Success]: 'success',
  [ButtonStyles.Danger]: 'destructive',
  [ButtonStyles.Link]: 'secondary',
} as const;

export function renderComponent(
  component: {
    emoji?:
      | {
          id?: bigint | undefined;
          name?: string | undefined;
          animated?: boolean | undefined;
        }
      | undefined;
    url?: string | undefined;
    value?: string | undefined;
    options?:
      | {
          description?: string | undefined;
          emoji?:
            | {
                id?: bigint | undefined;
                name?: string | undefined;
                animated?: boolean | undefined;
              }
            | undefined;
          default?: boolean | undefined;
          value: string;
          label: string;
        }[]
      | undefined;
    components?: any[] | undefined;
    disabled?: boolean | undefined;
    customId?: string | undefined;
    label?: string | undefined;
    style?: ButtonStyles | TextStyles | undefined;
    placeholder?: string | undefined;
    minValues?: number | undefined;
    maxValues?: number | undefined;
    type: MessageComponentTypes;
  },
  id: number,
) {
  if (component.type === MessageComponentTypes.Button) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style!]}
        url={component.url ?? undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  }

  return undefined;
}
