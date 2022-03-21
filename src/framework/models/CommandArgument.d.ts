import { ApplicationCommandOptionTypes } from "discord.js/typings/enums"

export interface CommandParameters {
    readonly name: string,
    readonly description: string,
    readonly required: boolean,
    readonly type: ApplicationCommandOptionTypes
}