import { ApplicationCommandOptionTypes } from "discord.js/typings/enums"

export interface CommandParameters {
    readonly name: string
    readonly description: string
    readonly type: ApplicationCommandOptionTypes
    readonly required: boolean
    readonly long: boolean
}