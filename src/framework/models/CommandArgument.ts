import { ApplicationCommandOptionTypes } from "discord.js/typings/enums"

export interface CommandParameters {
    name: string,
    description: string,
    required: boolean,
    type: ApplicationCommandOptionTypes
}