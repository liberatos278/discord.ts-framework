export interface EventOptions {
    readonly name: string
    readonly description: string
    readonly intents: number[]
}

export type EventExecute = (...args: any[]) => Promise<any>