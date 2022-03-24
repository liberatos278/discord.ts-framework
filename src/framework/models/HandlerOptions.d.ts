import { ExtendedOptionProperty } from "./ExtendedOptionProperty"
import { GuildPermission } from "./Permissions"

export interface HandlerOptions {
    readonly useSlashCommands?: boolean
    readonly prefix?: string
    readonly ignoreBots?: boolean
    readonly commandDoesNotExist?: ExtendedOptionProperty
    readonly insufficientPermissions?: ExtendedOptionProperty
    readonly wrongCommandSyntax?: ExtendedOptionProperty
    readonly commandCooldown?: ExtendedOptionProperty
    readonly permissions?: GuildPermission[]
    readonly disable?: boolean
}