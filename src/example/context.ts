import type {
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { ApplicationCommandType } from "discord.js";
import { ContextMenu, Discord } from "discordx";

@Discord()
export class Example {
  @ContextMenu({
    name: "message context",
    type: ApplicationCommandType.Message,
  })
  messageHandler(interaction: MessageContextMenuCommandInteraction): void {
    interaction.reply("I am user context handler");
  }

  @ContextMenu({ name: "user context", type: ApplicationCommandType.User })
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    interaction.reply("I am user context handler");
  }
}
