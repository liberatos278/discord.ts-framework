import { Intents } from "discord.js"
import { CommandParameters } from "./CommandParameters"

export interface CommandOptions {
    readonly name: string
    readonly description: string
    readonly category?: string
    readonly permissions: number
    readonly cooldown?: number
    readonly intents: number[]
    readonly allowedChannels?: string[] | null
    readonly disabledChannels?: string[] | null
    readonly parameters?: CommandParameters[]
}

export type CommandExecute = (...args: any[]) => Promise<any>