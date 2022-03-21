import { EventExecute, EventOptions } from "../models/EventOptions"

export class Event {

    public execute!: EventExecute

    constructor(
        public options: EventOptions
    ) {}

    public async registerFunction(func: EventExecute): Promise<void> {
        this.execute = func
    }
}