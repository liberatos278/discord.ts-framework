import { ExtendedOptionProperty } from "./ExtendedOptionProperty"
import { GuildPermission } from "./Permissions"

export interface HandlerOptions {
    useSlashCommands?: boolean
    prefix?: string
    ignoreBots?: boolean
    readonly commandDoesNotExist?: ExtendedOptionProperty
    readonly insufficientPermissions?: ExtendedOptionProperty
    readonly wrongCommandSyntax?: ExtendedOptionProperty
    readonly commandCooldown?: ExtendedOptionProperty
    permissions?: GuildPermission[]
    disable?: boolean
}