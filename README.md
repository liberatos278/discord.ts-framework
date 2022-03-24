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
interface FrameworkOptions {
	
	// Discord client token
	token: string,

	// Pre-built handler options
	handlerOptions?: {
		
		// Use Discord slash commands or message handler (default false)
		useSlashCommands?: boolean,
		
		// Prefix for message handler, required if 'useSlashCommands' is false
		prefix?: string,

		// If true, the framework will ignore requests from bots (default false)
		ignoreBots?: boolean,

		// The case when the specified command does not exist
		commandDoesNotExist?: {

			// The message the bot sends if the command does not exist (default 'Command does not exist')
			content?: string,

			// To turn off sending response messages (default false)
			disable?: boolean
		},
		
		insufficientPermissions?: {

			// The message the bot sends if message author has insufficient permissions (default 'Insufficient permissions')
			content?: string,

			// To turn off sending response messages (default false)
			disable?: boolean
		},
	
		wrongCommandSyntax?: {
		
            // The message the bot sends if some of specified argument is wrong (default 'Argument {{name}} is not correct')
			// We can also use variables:
			// {{specified}} | Specified argument from author
			// {{name}} | Name of expected argument
			// {{description}} | Description of expected argument
			// {{expected}} | Expected type of argument
			content?: string,

			// To turn off sending response messages (default false)
			disable?: boolean
		},

    commandCooldown?: {
      
            // The message the bot sends if message author is under command cooldown (default 'Take a break')
			content?: string,

			// To turn off sending response messages (default false)
			disable?: boolean
    },
		
		// Declaration of permissions
		permissions?: RolePermissions[],

		// Disable pre-built command handler
		disable?: boolean
		
	}
}
```

#### Permissions
In the command handler we can declare the permission level for a role or user, using its ID and guild ID. Everyone has a default permission level 0.

```js
const options = handlerOptions {
	permissions: [
		{
			guildId: '775024087520510042',
			permissions: [
			    {
			        id: '371020157460829953',
                    type: 'user',
                    level: 1
			    },
			    {
			        id: '457821157460829953',
                    type: 'role',
                    level: 5
			    }
			]
		}
	]
}
```

## Methods
Methods that can be used within the framework.

- **add(path: string): ClientModules *(async)*** <br>
Adds files or folders with commands or events to framework.

- **init(): Client *(async)*** <br>
It creates a client, which it then returns. This method creates event listeners for events and also logs in the client itself.

- **createEnmap(options: TableOptions): Enmap** <br>
Creates a database that is then stored in the client object according to the 'tableName' property. Table options are EnmapOptions that are extended by the property 'tableName', which is required.

```js
	f.createEnmap({ tableName: 'users', autoFetch: true })
	client.database.users.set('number', 5)
```

## Creating command
```js
export const ping = new Command({
    name: 'ping',
    description: 'Get latency of bot',
    category: 'misc',
    permissions: 1,
    cooldown: 1000,
    intents: [],
    allowedChannels: null,
    disabledChannels: null,
    parameters: []
})

ping.registerFunction(async (client, message, args) => {
    console.log('You used ping command')
})
```

#### Intents
In command options you can also set the intents that the bot will need to execute the command. The intents are evaluated and automatically set before the bot is executed.

#### Allowed channels
We can specify the channels in which the command can be used. The channels are defined using the CommandRestrictions structure:

```js
allowedChannels: [
    {
        guildId: '775024087520510042',
        channels: ['789524087520510042', '457024087575216042']
    }
]
```

#### Disabled channels
These are the channels in which the command is forbidden to be used. If 'null' is specified, this option is disabled. Channels are declared in the same way as for property allowed channels.

#### Parameters
They can be added using property parameters of the following form:

```js
parameters: [
	{
		name: 'member',
		description: 'Member to mention',
		type: ApplicationCommandOptionTypes.USER,
		required: true,
		long: false
	}
]
```

Also the built-in command handler will check the argument types. The long property will only be used if the slash command handler is not enabled. This option means that the argument to be specified by the user can consist of more than 1 word.

## Creating event
The parameters that will be used in the function that is declared by the 'registerFunction' method are dynamic according to the selected event.

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