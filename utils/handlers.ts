import type { Client } from 'discord.js';
import register from './register';
import { colours, emojis } from './logger';
import fs from 'fs';
import path from 'path';



export async function commandsHandler(client: Client) {
    const commands: any[] = [];

    const commandsCategories = fs.readdirSync(path.join(__dirname, '..', 'commands'), { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => path.join(__dirname, '..', 'commands', file.name));

    for (const commandsCategory of commandsCategories) {
        const Categoryfiles = fs.readdirSync(commandsCategory, { withFileTypes: true })
            .filter((file) => !file.isDirectory())
            .map((file) => path.join(commandsCategory, file.name));

        for (const file of Categoryfiles) {
            const slashCommand = await import(file);
            if ('data' in slashCommand && 'execute' in slashCommand) {
                commands.push(slashCommand);
            } else {
                console.log(colours.yellow, `[${emojis.warning}] The command at ${file} is missing a required "data" or "execute" property`, colours.reset);
            }
        }
    }

    register(commands)

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const slashCommand = commands.find((command) => command.name === interaction.commandName);
        if (!slashCommand) return;
        try {
            await slashCommand.execute(client, interaction);
        } catch (error) {
            console.log(colours.red, `[${emojis.error}] There is an error in ${slashCommand.name} execute:`, colours.reset);
            console.log(error);
            interaction.reply({ content: 'There was an error!', ephemeral: true });
        }
    });
}

export function eventsHandler(client: Client) {
    const eventFolders = fs.readdirSync(path.join(__dirname, '..', 'events'), { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => path.join(__dirname, '..', 'events', file.name));

    eventFolders.forEach((eventFolder) => {
        const eventFiles = fs.readdirSync(eventFolder, { withFileTypes: true })
            .filter((file) => !file.isDirectory())
            .map((file) => path.join(eventFolder, file.name));

        eventFiles.sort((a, b) => a.localeCompare(b));
        const eventName = path.basename(eventFolder);

        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                import(eventFile).then(eventFunction => {
                    eventFunction.default(client, arg);
                });
            }
        });
    });
}
