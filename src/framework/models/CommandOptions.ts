import { Intents } from "discord.js"
import { CommandParameters } from "./CommandArgument"

export interface CommandOptions {
    name: string
    description: string
    category: string
    permissions: number
    intents: number[]
    allowedChannels: string[] | null
    disabledChannels: string[] | null
    parameters: CommandParameters[]
    execute: (...args: any[]) => Promise<any>
}