import { Category } from "@discordx/utilities";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";

@Discord()
@Category("Afk")
export class Afk {
  @SimpleCommand({
    name: "afk",
    aliases: ["afk set"],
    description: "Set your AFK 😴",
  })
  afk(
    command: SimpleCommandMessage,
    @SimpleCommandOption({
      name: "reason",
      description: "Reason for going afk",
      type: SimpleCommandOptionType.String,
    })
    reason?: string
  ): void {}
}
