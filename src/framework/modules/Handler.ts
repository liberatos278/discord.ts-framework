import { ApplicationCommandOptionType } from "discord-api-types"
import { GuildMember, Message, Snowflake } from "discord.js"
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums"
import { CommandSyntaxAnalysis } from "../models/CommandSyntaxAnalysis"
import { CommandParametersTypes } from "../enums/CommandParameterTypes"
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

        this.client.on('messageCreate', async (message) => {
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

                const areArgumentsCorrect = await this.checkArguments(command, args, message)
                if (!areArgumentsCorrect.result) {
                    if (!this.options.wrongCommandSyntax?.disable) {
                        message.reply(
                            this.formatWrongSyntaxResponse(this.options.wrongCommandSyntax?.content, areArgumentsCorrect) ?? 
                            `Argument **${areArgumentsCorrect.error?.wantedParam.name}** is not correct`
                        )
                    }

                    return
                }
                    
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

            if (member.roles.cache.has(permission.id) && permission.type === 'role') {
                level = permission.level

            } else if (member.id === permission.id && permission.type === 'user') {
                level = permission.level
            }
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

    private async checkArguments(command: Command, args: string[], message: Message): Promise<CommandSyntaxAnalysis> {
        let syntaxAnalysis: CommandSyntaxAnalysis = { result: true }

        if (command.options.parameters.length < 1) 
            return syntaxAnalysis

        if (args.length < 1) {
            syntaxAnalysis.result = false
        }

        for (const [key, wantedArg] of command.options.parameters.entries()) {
            const arg = args[key as number]

            if (wantedArg.long && wantedArg.required) {
                break
            }

            if (wantedArg.long) {
                if (!arg) {
                    syntaxAnalysis = {
                        result: false,
                        error: {
                            specifiedParam: arg,
                            wantedParam: wantedArg
                        }
                    }
                }
                    
                break
            }

            if (wantedArg.required) {
                if (!arg) {
                    syntaxAnalysis.result = true
                    break
                }

                const isArgCorrect = await this.checkTypeOfArg(arg, wantedArg.type, message)
                if (!isArgCorrect) {
                    syntaxAnalysis = {
                        result: false,
                        error: {
                            specifiedParam: arg,
                            wantedParam: wantedArg
                        }
                    }
                    break
                }

                continue
            
            } else {
                if (!arg) {
                    if (args.length < 1)
                        syntaxAnalysis.result = true

                    break
                }
            }

            syntaxAnalysis.result = await this.checkTypeOfArg(arg, wantedArg.type, message)
            if (!syntaxAnalysis.result) {
                syntaxAnalysis.error = {
                    specifiedParam: arg,
                    wantedParam: wantedArg
                }

                break
            }
        }

        return syntaxAnalysis
    }

    private async checkTypeOfArg(arg: string, type: ApplicationCommandOptionTypes, message: Message): Promise<boolean> {

        if (!arg)
            return false

        switch (type) {
            case ApplicationCommandOptionTypes.SUB_COMMAND:
            case ApplicationCommandOptionTypes.STRING:
                return true

            case ApplicationCommandOptionTypes.INTEGER:
                return !isNaN(Number(arg)) && Number.isInteger(Number(arg))

            case ApplicationCommandOptionTypes.NUMBER:
                return !isNaN(Number(arg))

            case ApplicationCommandOptionTypes.BOOLEAN:
                return arg === 'true' || arg === 'false'

            case ApplicationCommandOptionTypes.ROLE:
                const roleSnowflake = this.getSnowflakeFromArg(arg)
                const role = message.guild?.roles.cache.get(roleSnowflake)

                return role ? true : false

            case ApplicationCommandOptionTypes.CHANNEL:
                const channelSnowflake = this.getSnowflakeFromArg(arg)
                const channel = message.guild?.channels.cache.get(channelSnowflake)

                return channel ? true : false

            case ApplicationCommandOptionTypes.USER:
                const userSnowflake = this.getSnowflakeFromArg(arg)
                const user = await this.client.users.fetch(userSnowflake).catch(() => false)

                return user ? true : false

            case ApplicationCommandOptionTypes.MENTIONABLE:
                const mentionableSnowflake = this.getSnowflakeFromArg(arg)
                const obj = await this.client.users.fetch(mentionableSnowflake).catch(() => false) || message.guild?.roles.cache.get(mentionableSnowflake)

                return obj ? true : false

            default:
                return false
        }
    }

    private getSnowflakeFromArg(arg: string): Snowflake {
        return arg.replace('<', '').replace('>', '').replace('@', '').replace('#', '').replace('&', '').replace('!', '')
    }

    private formatWrongSyntaxResponse(content: string | undefined, data: CommandSyntaxAnalysis): string | undefined {
        if (!content || !data.error)
            return undefined

        return content
            .replaceAll('{{specified}}', data.error.specifiedParam)
            .replaceAll('{{name}}', data.error.wantedParam.name)
            .replaceAll('{{description}}', data.error.wantedParam.description)
            .replaceAll('{{expected}}', CommandParametersTypes[data.error.wantedParam.type].toLowerCase())
    }
}