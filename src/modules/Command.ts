import { Collection } from "discord.js"
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums"
import { CommandExecute, CommandOptions } from "../models/CommandOptions"
import { CommandParameters } from "../models/CommandParameters"
import { SubCommand } from "../models/SubCommand"
import { SubCommandData } from "../models/SubCommandData"
import { SubCommandResult } from "../models/SubCommandResult"

export class Command {

    public execute!: CommandExecute
    public subCommands: Collection<string, SubCommand> = new Collection()

    constructor(
        public options: CommandOptions
    ) {}

    public registerFunction(func: CommandExecute): void {
        this.execute = func
    }

    public registerSubCommand(data: SubCommandData, func: CommandExecute): void {
        const toSave: SubCommand = {
            data,
            execute: func
        }

        this.subCommands.set(data.name, toSave)
    }

    public getSubCommand(args: string[]): SubCommandResult | undefined {
        const expected = this.options.parameters

        let result: SubCommandResult = {
            command: this,
            args
        }

        if (!expected || expected.length < 1) 
            return result

        if (expected[0].type !== ApplicationCommandOptionTypes.SUB_COMMAND) {
            if (expected.find((param: CommandParameters) => param.type === ApplicationCommandOptionTypes.SUB_COMMAND))
                throw new Error(`Sub command must be the first parameter`)

            return result
        }

        if (!args[0])
            return undefined
        
        const subCommandData = this.subCommands.get(args[0].toLowerCase())

        if (!subCommandData)
            return undefined

        let scIntents = (this.options.intents ?? []).concat(subCommandData.data.intents ?? [])
        let scAllowedChannels = (this.options.allowedChannels ?? []).concat(subCommandData.data.allowedChannels ?? [])
        let scDisabledChannels = (this.options.disabledChannels ?? []).concat(subCommandData.data.disabledChannels ?? [])

        const subCommand = new Command({
            name: subCommandData.data.name,
            description: subCommandData.data.description,
            category: this.options.category,
            permissions: subCommandData.data.permissions,
            cooldown: this.options.cooldown,
            intents: scIntents,
            allowedChannels: scAllowedChannels,
            disabledChannels: scDisabledChannels,
            parameters: subCommandData.data.parameters
        })

        subCommand.registerFunction(subCommandData.execute)
        args.shift()
        
        return {
            command: subCommand,
            args
        }
    }
}