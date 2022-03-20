import Discord from 'discord.js'
import { FrameworkOptions } from '../models/FrameworkOptions'
import { Command } from './Command'
import { Event } from './Event'

export class Client extends Discord.Client {
    
    constructor(
        public frameworkOptions: FrameworkOptions,
        public intents: Discord.Intents,
        public commands: Discord.Collection<string, Command>,
        public events: Discord.Collection<string, Event>
    ) {
        super({ intents })
        this._setup()
    }

    private _setup(): void {
        this._createListeners()
        this.login(this.frameworkOptions.token)
    }

    private _createListeners(): void {
        for (let event of Array.from(this.events.values())) {
            this.on(event.options.name, event.options.execute.bind(null, this))
        }
    }
}