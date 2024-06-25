import type { Client } from 'discord.js';
import { colours, emojis  } from './logger'
import * as fs from 'fs'
import * as path from 'path'

export function getAllCommands() {
    const commands:any[] = []

    //Get all categories in commmands folder
    const commandsCategories = fs.readdirSync(path.join(__dirname, 'commands'), { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => path.join(__dirname, 'commands', file.name))

    //Get each category in commmands folder
    commandsCategories.forEach((commandsCategory) => {
        //Get files in each category
        const Categoryfiles = fs.readdirSync(commandsCategory, { withFileTypes: true })
            .filter((file) => !file.isDirectory())
            .map((file) => path.join(commandsCategory, file.name))
            //Get each file in files as Object (slashCommand) (we can access to slashCommand data and execute function from object)
            .forEach((file) => {
                const slashCommand = require(file)

                if ('data' in slashCommand && 'execute' in slashCommand) {
                    commands.push(slashCommand)
                } else {
                    console.log(colours.yellow , `[${emojis.warning}] The command at ${file} is missing a required "data" or "execute" property`, colours.reset);
                }
            })
    })

    return commands;
}

export function commandsHandler(client:Client) {
   
    const commands = getAllCommands()

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const slashCommand = commands.find((command) => command.name === interaction.commandName)
        if(!slashCommand) return;
        try{
            await slashCommand.execute(client, interaction)
        } catch (error) {
            console.log(colours.red , `[${emojis.error}] There is an error in ${slashCommand.name} execute:`, colours.reset)
            console.log(error)
            interaction.reply({ content: 'There was an error!', ephemeral: true })
        }
    })
}

export function eventsHandler(client:Client) {
    const eventFolders = fs.readdirSync(path.join(__dirname, 'events'), { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => path.join(__dirname, 'events', file.name))

    eventFolders.forEach((eventFolder) => {
        const eventFiles = fs.readdirSync(eventFolder, { withFileTypes: true })
        .filter((file) => !file.isDirectory())
        .map((file) => path.join(eventFolder, file.name))

        eventFiles.sort((a, b) => a.localeCompare(b));
        const eventName = path.basename(eventFolder);

        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }
        });
    })  
}
