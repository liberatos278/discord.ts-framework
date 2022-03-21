export const log = (prefix: string, content: string): void => {
    let color = ''

    switch(prefix.toLowerCase()) {
        case 'framework':
            color = '\u001b[36m'
            break

        case 'client':
            color = '\u001b[32m'
            break

        case 'handler':
            color = '\u001b[33m'
            break

        case 'error':
            color = '\u001b[31m'
            break
    }

    console.log(`${color}[${prefix.toUpperCase()}]\u001b[0m: ${content}`)
}