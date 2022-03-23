import { ExtendedOptionProperty } from "./ExtendedOptionProperty"
import { RolePermission } from "./RolePermission"

export interface HandlerOptions {
    readonly useSlashCommands?: boolean
    readonly prefix?: string
    readonly ignoreBots?: boolean
    readonly commandDoesNotExist?: ExtendedOptionProperty
    readonly insufficientPermissions?: ExtendedOptionProperty
    readonly wrongCommandSyntax?: ExtendedOptionProperty
    readonly commandCooldown?: ExtendedOptionProperty
    readonly permissions?: RolePermission[]
    readonly disable?: boolean
}