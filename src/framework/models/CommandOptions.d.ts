import { Intents } from "discord.js"
import { CommandParameters } from "./CommandArgument"

export interface CommandOptions {
    readonly name: string
    readonly description: string
    readonly category: string
    readonly permissions: number
    readonly intents: number[]
    readonly allowedChannels: string[] | null
    readonly disabledChannels: string[] | null
    readonly parameters: CommandParameters[]
}

export type CommandExecute = (...args: any[]) => Promise<any>