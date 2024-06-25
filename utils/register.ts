import { REST, Routes } from 'discord.js'
import { getAllCommands } from './handlers';
import { ensureEnv } from './envValidator'
import { colours, background, emojis} from './logger';

const counter = 0
const commands = getAllCommands()

const rest = new REST({ version: '10' }).setToken(ensureEnv("TOKEN"));

(async () => {
    try {
        console.log(colours.yellow, `[${emojis.wait}] Registering slash commands ...`, colours.reset)

        await rest.put(
            Routes.applicationGuildCommands(ensureEnv("TOKEN"), ensureEnv("GUILD_ID")),
            {
                body: commands
            }
        )

        console.log(colours.green, `${emojis.success} ${counter} slash commands werw registered successfully.`, colours.reset)
    } catch (error) {
        console.log(colours.red , `[${emojis.error}] There is an error in registering slash commands:`, colours.reset)
        console.log(error)
    }
})