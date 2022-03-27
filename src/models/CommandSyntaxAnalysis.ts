import { CommandParameters } from "./CommandParameters"

export interface CommandSyntaxAnalysis {
    result: boolean,
    error?: {
        specifiedParam: string,
        wantedParam: CommandParameters
    }
}