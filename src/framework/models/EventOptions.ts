export interface EventOptions {
    name: string
    description: string
    intents: number[]
    execute: (...args: any[]) => Promise<any>
}