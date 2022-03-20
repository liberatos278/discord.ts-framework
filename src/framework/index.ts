import Discord, { Intents } from 'discord.js'
import fs from 'fs'
import { FrameworkOptions } from './models/FrameworkOptions'
import { Client } from './modules/Client'
import { Command } from './modules/Command'
import { Event } from './modules/Event'

export class Framework {

    private _commands: Discord.Collection<string, Command> = new Discord.Collection()
    private _events: Discord.Collection<string, Event> = new Discord.Collection()

    constructor(
        private readonly _options: FrameworkOptions
    ) { }

    public async add(path: string): Promise<void> {
        try {
            const files = fs.readdirSync(path)

            for (let file of files) {
                const rawModule = await import(`${path}/${file}`)
                const moduleName = Object.keys(rawModule)[0] as string

                const clientModule: Command | Event = rawModule[moduleName]

                if (clientModule instanceof Command) {
                    console.log('Command')
                    this._commands.set(clientModule.options.name, clientModule)

                } else if (clientModule instanceof Event) {
                    console.log('Event')
                    this._events.set(clientModule.options.name, clientModule)

                } else {
                    throw new TypeError('Module must be a Command or Event')
                }
            }
        } catch (err: unknown) {
            throw err
        }
    }

    public async init(): Promise<Client> {
        const client = new Client(
            this._options, 
            this.intents, 
            this._commands, 
            this._events
        )

        return client
    }

    private get intents(): Intents {
        const intents = new Intents()

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
}