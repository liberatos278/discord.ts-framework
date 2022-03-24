import { Command } from "../modules/Command";

export interface SubCommandResult {
    command: Command,
    args: string[]
}