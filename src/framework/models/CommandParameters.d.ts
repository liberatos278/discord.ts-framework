import { ApplicationCommandOptionType } from "discord.js/typings/enums"

export interface CommandParameters {
    readonly name: string
    readonly description: string
    readonly type: ApplicationCommandOptionType
    readonly required?: boolean
    readonly long?: boolean
}