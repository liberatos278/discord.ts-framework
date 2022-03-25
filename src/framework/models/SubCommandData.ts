import { CommandParameters } from "./CommandParameters"
import { CommandRestrictions } from "./CommandRestrictions"

export interface SubCommandData {
    readonly name: string
    readonly description: string
    readonly permissions?: number
    readonly intents?: number[]
    readonly allowedChannels?: CommandRestrictions[]
    readonly disabledChannels?: CommandRestrictions[]
    readonly parameters?: CommandParameters[]
}