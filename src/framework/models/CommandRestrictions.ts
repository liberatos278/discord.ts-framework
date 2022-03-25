import { Snowflake } from "discord-api-types"

export interface CommandRestrictions {
    guildId: Snowflake,
    channels: Snowflake[]
}