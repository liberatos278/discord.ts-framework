import { Intents } from "discord.js"
import { CommandParameters } from "./CommandParameters"
import { CommandRestrictions } from "./CommandRestrictions"

export interface CommandOptions {
    readonly name: string
    readonly description: string
    readonly category?: string
    readonly permissions: number
    readonly cooldown?: number
    readonly intents: number[]
    readonly allowedChannels?: CommandRestrictions[]
    readonly disabledChannels?: CommandRestrictions[]
    readonly parameters?: CommandParameters[]
}

export type CommandExecute = (...args: any[]) => Promise<any>