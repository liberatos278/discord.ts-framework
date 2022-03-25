import { CommandExecute } from "./CommandOptions";
import { SubCommandData } from "./SubCommandData";

export interface SubCommand {
    data: SubCommandData
    execute: CommandExecute
}