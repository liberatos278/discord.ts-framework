import { Snowflake } from "discord-api-types";

export interface RolePermission {
    roleId: Snowflake,
    level: number
}