import type { CommandInteraction, Message } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  Slash,
} from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ aliases: ["hi"] })
  hello(command: SimpleCommandMessage): void {
    command.message.reply(`👋 ${command.message.member}`);
  }

  @SimpleCommand({ argSplitter: "+" })
  sum(
    @SimpleCommandOption({ name: "num1", type: SimpleCommandOptionType.Number })
    num1: number | undefined,
    @SimpleCommandOption({ name: "num2", type: SimpleCommandOptionType.Number })
    num2: number | undefined,
    command: SimpleCommandMessage
  ): void {
    if (!num1 || !num2) {
      command.sendUsageSyntax();
      return;
    }
    command.message.reply(`total = ${num1 + num2}`);
  }

  // make single handler for simple and slash command
  likeIt(command: CommandInteraction | Message): void {
    command.reply("I like it, Thanks");
  }

  @SimpleCommand({ name: "like-it" })
  simpleLikeIt(command: SimpleCommandMessage): void {
    this.likeIt(command.message);
  }

  @Slash({ description: "like-ite", name: "like-it" })
  slashLikeIt(command: CommandInteraction): void {
    this.likeIt(command);
  }
}
