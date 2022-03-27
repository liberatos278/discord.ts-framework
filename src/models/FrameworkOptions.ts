import { Snowflake } from "discord-api-types"
import { HandlerOptions } from "./HandlerOptions"

export interface FrameworkOptions {
    readonly token: string
    readonly clientId: string
    readonly devMode?: DeveloperMode
    readonly handlerOptions: HandlerOptions
}

export interface DeveloperMode {
    toggle: boolean,
    guildId: Snowflake
}