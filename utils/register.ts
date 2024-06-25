import { REST, Routes } from 'discord.js'
import { ensureEnv } from './envValidator'
import { colours, background, emojis} from './logger';

export default (commands:{}[]) => {
    const correct_commands = [{}]
    let counter = 0
    commands.forEach((command:any) => {
        if(command.data.name) {
            correct_commands.push(command)
            console.log(colours.green, `[${emojis.success}] ${command.name} - Ready`, colours.reset)
            counter++
        } else {
            console.log(colours.red, `[${emojis.failed}] ${command.data.name} - Falid`, colours.reset)
        }
    })

    const rest = new REST({ version: '10' }).setToken(ensureEnv("TOKEN"));

    (async () => {
        try {
            console.log(colours.yellow, `[${emojis.wait}] Registering slash commands ...`, colours.reset)
    
            await rest.put(
                Routes.applicationGuildCommands(ensureEnv("CLIENT_ID"), ensureEnv("GUILD_ID")),
                {
                    body: correct_commands
                }
            )
    
            console.log(colours.green, `[${emojis.success}] ${counter} slash commands werw registered successfully.`, colours.reset)
        } catch (error) {
            console.log(colours.red , `[${emojis.error}] There is an error in registering slash commands:`, colours.reset)
            console.log(error)
        }
    })()
}