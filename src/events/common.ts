import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { AeonaBot } from "../utils/types";

@Discord()
export class Common {
  @On()
  messageDelete([message]: ArgsOf<"messageDelete">, client: AeonaBot): void {
    console.log("Message Deleted", client.user?.username, message.content);
  }
}
