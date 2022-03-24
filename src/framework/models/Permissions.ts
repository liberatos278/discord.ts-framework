import { Snowflake } from "discord-api-types"

export interface GuildPermission {
    guildId: Snowflake
    permissions: IdentificatorPermission[]
}

export interface IdentificatorPermission {
    id: Snowflake
    type: 'role' | 'user'
    level: number
}