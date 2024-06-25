import { Client, Partials } from 'discord.js'
import { colours, emojis  } from './utils/logger'
import { commandsHandler , eventsHandler } from './utils/handlers'
import { ensureEnv } from './utils/envValidator'

const client = new Client({
    intents: 32767,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
})

commandsHandler(client)
eventsHandler(client)

try {
    client.login(ensureEnv('TOKEN'))
} catch (error) {
    console.log(colours.red , `[${emojis.error}] There is an error in logging to client:`, colours.reset)
    console.log(error)   
}