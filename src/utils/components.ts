import {
  APIMessageActionRowComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
} from 'discord.js';

export class Components extends Array<ActionRowBuilder<MessageActionRowComponentBuilder>> {
  constructor(...args: ActionRowBuilder<MessageActionRowComponentBuilder>[]) {
    super(...args);

    return this;
  }

  /**
   * Don't allow more than 5 Action Rows
   * @returns The array itself.
   */
  addActionRow() {
    // Don't allow more than 5 Action Rows
    if (this.length === 5) return this;

    this.push(new ActionRowBuilder());
    return this;
  }

  addSelectComponent(
    label: string,
    customId: string,
    options: SelectMenuComponentOptionData[],
    placeholder?: string,
    minValues?: number,
    maxValues?: number,
    disabled?: boolean,
  ) {
    if (options.length > 25) throw new Error('SelectComponent Cannot have more than 25 options');
    this.addActionRow();
    let row = this[this.length - 1];
    const component = new SelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder ?? label)
      .addOptions(options);
    if (minValues) component.setMinValues(minValues);
    if (maxValues) component.setMaxValues(maxValues);
    if (disabled) component.setDisabled(disabled);

    row.addComponents(component);
  }
  /**
   * If the last Action Row has 5 buttons, create a new one, otherwise add the button to the last
   * Action Row
   * @param {string} label - The text that will be displayed on the button
   * @param style - keyof typeof ButtonStyle,
   * @param {string} idOrLink - The ID of the button or the URL of the link
   * @param [options] - { emoji?: string | bigint; disabled?: boolean }
   * @returns The object itself.
   */
  addButton(
    label: string,
    style: ButtonStyle | keyof typeof ButtonStyle,
    idOrLink: string,
    options?: { emoji?: ComponentEmojiResolvable; disabled?: boolean },
  ) {
    // No Action Row has been created so do it
    if (!this.length) this.addActionRow();

    // Get the last Action Row
    let row = this[this.length - 1];

    // If the Action Row already has 5 buttons create a new one
    if (row.components.length === 5) {
      this.addActionRow();
      row = this[this.length - 1];

      // Apparently there are already 5 Full Action Rows so don't add the button
      if (row.components.length === 5) return this;
    }
    const button = new ButtonBuilder();

    if (options?.emoji) button.setEmoji(options.emoji);
    if (options?.disabled) button.setDisabled(options.disabled);
    button.setCustomId(idOrLink);
    button.setLabel(label);

    if (typeof style === 'string') button.setStyle(ButtonStyle[style]);
    else button.setStyle(style);

    row.addComponents(button);
    return this;
  }
}
