<div align="center">
  <br />
  <p>
    <a><img src="https://i.imgur.com/tTOIyAr.png" width="546" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/discord.ts-framework"><img src="https://img.shields.io/npm/dw/discord.ts-framework?label=Downloads&style=flat-square" alt="Downloads" /></a>
    <a href="https://www.npmjs.com/package/discord.ts-framework"><img src="https://img.shields.io/npm/v/discord.ts-framework?label=npm&style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/discord.ts-framework"><img src="https://img.shields.io/npm/l/discord.ts-framework?label=License&style=flat-square" alt="License" /></a>
    <a href="https://github.com/liberatos278/discord.ts-framework/"><img src="https://img.shields.io/github/stars/liberatos278/discord.ts-framework?style=social" alt="Tests status" /></a>
  </p>
<br />
  </div>

## About
Universal, fully customizable framework that makes it easy to develop Discord clients.<br>
The module has pre-built functions including:

- Command handler
- Event handler
- Slash commands registration
- Enmap databases
- Automatic intents
- And many more

## Installation
The recommended version for Node.js is 16.0.0 or later.
```sh-session
npm install discord.ts-framework
```

## Example usage
```js
import Framework from 'discord.ts-framework'

const f = new Framework({
	token: 'token',
	useSlashCommands: true
})

const start = async () => {
	await f.add(__dirname + '/commands')
	await f.add(__dirname + '/events')

	await f.add(__dirname + '/ping.js')

	const client = await f.init()
}
```

## Framework options
The most important settings related to the Discord client itself.

```js
FrameworkOptions {
	
	// Discord client token
	token: string

	// Pre-built handler options
	handlerOptions?: {
		
		// Use Discord slash commands or message handler (default false)
		useSlashCommands?: boolean
		
		// Prefix for message handler, required if 'useSlashCommands' is false
		prefix?: string

		// If true, the framework will ignore requests from bots (default false)
		ignoreBots?: boolean

		// The case when the specified command does not exist
		commandDoesNotExist?: {

			// The message the bot sends if the command does not exist (default 'Command does not exist')
			content?: string

			// To turn off sending response messages (default false)
			disable?: boolean
		}
		
		insufficientPermissions?: {

			// The message the bot sends if message author has insufficient permissions (default 'Insufficient permissions')
			content?: string

			// To turn off sending response messages (default false)
			disable?: boolean
		}
		
		// Declaration of permissions
		permissions?: RolePermissions[]

		// Disable pre-built command handler
		disable?: boolean
		
	}
}
```

#### Permissions
In the command handler we can declare the permission level for a role, using its ID. Everyone has a default permission level 0.

```js
handlerOptions: {
	permissions: [
		{
			// Required role identifier
			roleId: Snowflake
			
			// Level of authorization
			level: number
		}
	]
}
```

## Methods
Methods that can be used within the framework.

- **add(path: string | string[]): ClientModules *(async)*** <br>
Adds files or folders with commands or events to framework.

- **init(): Client *(async)*** <br>
It creates a client, which it then returns. This method creates event listeners for events and also logs in the client itself.

## Creating command
```js
export const ping = new Command({
    name: 'ping',
    description: 'Get latency of bot',
    category: 'misc',
    permissions: 1,
    intents: [],
    allowedChannels: null,
    disabledChannels: null,
    parameters: []
})

ping.registerFunction(async () => {
    console.log('You used ping command')
})
```

#### Intents
#### Allowed & Disabled channels
#### Parameters

## Creating event
```js
export const ready = new Event({
    name: 'ready',
    description: 'On bot ready',
    intents: []
})

ready.registerFunction(async () => {
    console.log('Bot ready!')
})	
```