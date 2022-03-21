import { CommandExecute, CommandOptions } from "../models/CommandOptions"

export class Command {

    public execute!: CommandExecute

    constructor(
        public options: CommandOptions
    ) {}

    public async registerFunction(func: CommandExecute): Promise<void> {
        this.execute = func
    }
}