import Discord from 'discord.js'
import { FrameworkOptions } from '../models/FrameworkOptions'
import { TableCollection } from '../models/TableCollection'
import { Command } from './Command'
import { Event } from './Event'
import { Handler } from './Handler'
import { log } from './Logger'

export class Client extends Discord.Client {

    private _handler = new Handler(this)
    
    constructor(
        public frameworkOptions: FrameworkOptions,
        public intents: Discord.Intents,
        public commands: Discord.Collection<string, Command>,
        public events: Discord.Collection<string, Event>,
        public database: TableCollection
    ) {
        super({ intents })
        this._setup()
    }

    private _setup(): void {
        this._createListeners()
        this._handler.start(this.frameworkOptions.handlerOptions)

        this.login(this.frameworkOptions.token).then(() => {
            log('client', `Client \u001b[37;1m${this.user?.tag}\u001b[0m logged in`)
        })
    }

    private _createListeners(): void {
        for (let event of Array.from(this.events.values())) {
            this.on(event.options.name, event.execute.bind(null, this))
        }
    }
}