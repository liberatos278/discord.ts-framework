import { Snowflake } from "discord-api-types";

export interface RolePermission {
    id: Snowflake
    type: 'role' | 'user'
    level: number
}