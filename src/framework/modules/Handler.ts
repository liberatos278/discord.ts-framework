import { GuildMember, Message, Snowflake } from "discord.js"
import { HandlerOptions } from "../models/HandlerOptions"
import { Client } from "./Client"
import { Command } from "./Command"
import { log } from "./Logger"

export class Handler {

    public options!: HandlerOptions

    constructor(
        public client: Client
    ) { }

    public start(handlerOptions: HandlerOptions): void {
        this.options = handlerOptions

        if (handlerOptions.disable)
            return

        if (handlerOptions.useSlashCommands) {
            this.registerSlashHandler()
            log('handler', 'Registering slash commands...')

        } else {
            this.registerCustomHandler()
            log('handler', 'Native handler created')
        }
    }

    private registerSlashHandler(): void {

    }

    private registerCustomHandler(): void {
        if (!this.options.prefix)
            throw new Error('Prefix is required for custom handler')

        this.client.on('messageCreate', (message) => {
            if (this.hasMessagePrefix(message)) {
                const content = message.content
                const args: string[] = content.slice(this.options.prefix?.length).split(/ +/g)
                const commandName: string | undefined = args.shift()

                if (!commandName || (message.author.bot && this.options.ignoreBots) || !message.guild)
                    return

                const command = this.doesCommandExist(commandName.toLowerCase())

                if (!command) {
                    if (!this.options.commandDoesNotExist?.disable) {
                        message.reply(this.options.commandDoesNotExist?.content ?? 'Command does not exist')
                    }

                    return
                }

                if (!message.member)
                    return

                if (!this.isChannelAllowedForCommand(command, message.channelId))
                    return

                const userPermissions = this.getUsersPermissionLevel(message.member)
                if (userPermissions < command.options.permissions) {
                    if (!this.options.insufficientPermissions?.disable) {
                        message.reply(this.options.insufficientPermissions?.content ?? 'Insufficient permissions')
                    }

                    return
                }

                // Arguments validation

                command.execute(this.client, message, args)
            }
        })
    }

    private hasMessagePrefix(message: Message): boolean {
        const content: string = message.content

        if (!this.options.prefix)
            throw new Error('Prefix is required for custom handler')

        return content.startsWith(this.options.prefix)
    }

    private doesCommandExist(commandName: string): Command | undefined {
        return this.client.commands.get(commandName)
    }

    private getUsersPermissionLevel(member: GuildMember): number {
        let level = 0

        if (!this.options.permissions)
            return level

        for (const permission of this.options.permissions) {

            if (member.roles.cache.has(permission.roleId))
                level = permission.level
        }

        return level
    }

    private isChannelAllowedForCommand(command: Command, channelId: Snowflake): boolean {
        let result = false

        if (command.options.allowedChannels) {
            result = command.options.allowedChannels.includes(channelId)
        } else
            result = true

        if (result && command.options.disabledChannels) {
            result = !command.options.disabledChannels.includes(channelId)
        }

        return result
    }
}