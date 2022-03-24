export interface SubCommandData {
    readonly name: string
    readonly description?: string
    readonly permissions?: number
    readonly intents?: number[]
    readonly allowedChannels?: CommandRestrictions[]
    readonly disabledChannels?: CommandRestrictions[]
    readonly parameters?: CommandParameters[]
}