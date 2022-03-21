import Enmap from "enmap"

export interface TableCollection {
    [table: string]: Enmap | any
}