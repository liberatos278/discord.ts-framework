import { Command } from "../modules/Command"
import { Event } from "../modules/Event"

export interface ClientModules {
    readonly commands: Command[]
    readonly events: Event[]
}