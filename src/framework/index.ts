import Discord, { Intents } from 'discord.js'
import Enmap from 'enmap'
import fs from 'fs'
import { ClientModules } from './models/ClientModules'
import { FrameworkOptions } from './models/FrameworkOptions'
import { TableCollection } from './models/TableCollection'
import { TableOptions } from './models/TableOptions'
import { Client } from './modules/Client'
import { Command } from './modules/Command'
import { Event } from './modules/Event'
import { log } from './modules/Logger'
import { basename } from 'path'
import { Snowflake } from 'discord-api-types'
import { GuildPermission, IdentificatorPermission } from './models/Permissions'

export default class Framework {

    private _commands: Discord.Collection<string, Command> = new Discord.Collection()
    private _events: Discord.Collection<string, Event> = new Discord.Collection()
    private _database: TableCollection = {}

    constructor(
        private readonly _options: FrameworkOptions
    ) { }

    public async add(path: string): Promise<ClientModules> {
        try {
            const stat = await fs.promises.lstat(path)
            let files: string[] = []

            if (stat.isDirectory()) {
                files = await fs.promises.readdir(path)
            
            } else if (stat.isFile()) {
                files = [basename(path)]
            }

            for (let file of files) {
                const rawModule = stat.isDirectory() ? await import(`${path}/${file}`) : await import(path)
                const moduleName = Object.keys(rawModule)[0] as string

                const clientModule: Command | Event = rawModule[moduleName]

                if (clientModule instanceof Command) {
                    log('framework', `Command \u001b[37;1m${moduleName}\u001b[0m loaded`)
                    this._commands.set(clientModule.options.name, clientModule)

                } else if (clientModule instanceof Event) {
                    log('framework', `Event \u001b[37;1m${moduleName}\u001b[0m loaded`)
                    this._events.set(clientModule.options.name, clientModule)

                } else {
                    throw new TypeError('Module must be a Command or Event')
                }
            }
        } catch (err: unknown) {
            throw err
        }

        const result: ClientModules = {
            commands: Array.from(this._commands.values()),
            events: Array.from(this._events.values()),
        }

        return result
    }

    public async init(): Promise<Client> {
        log('client', 'Initializing client...')

        const client = new Client(
            this._options, 
            this.intents, 
            this._commands, 
            this._events,
            this._database
        )

        return client
    }

    private get intents(): Intents {
        const intents = new Intents()
        const defaultIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]

        intents.add(defaultIntents)

        if (this._commands.size < 1 && this._events.size < 1)
            return intents

        for(let command of Array.from(this._commands.values())) {
            intents.add(command.options.intents)
        }

        for(let event of Array.from(this._events.values())) {
            intents.add(event.options.intents)
        }

        return intents
    }

    public createEnmap(options: TableOptions): Enmap {
        const database = new Enmap(options)

        this._database[options.tableName] = database
        return database
    }

    public addPermissions(permissions: IdentificatorPermission | IdentificatorPermission[], guildId: Snowflake): GuildPermission {

        if (!Array.isArray(permissions))
            permissions = [permissions]

        const data: GuildPermission = {
            guildId,
            permissions
        }

        if (!this._options.handlerOptions.permissions)
            this._options.handlerOptions.permissions = []

        this._options.handlerOptions.permissions.push(data)
        return data
    }

    public setPrefix(prefix: string): string {
        this._options.handlerOptions.prefix = prefix
        return prefix
    }

    public disableCommandHandler(toggle: boolean): boolean {
        this._options.handlerOptions.disable = toggle
        return toggle
    }

    public ignoreBots(toggle: boolean): boolean {
        this._options.handlerOptions.ignoreBots = toggle
        return toggle
    }

    public useSlashCommands(toggle: boolean): boolean {
        this._options.handlerOptions.useSlashCommands = toggle
        return toggle
    }
}