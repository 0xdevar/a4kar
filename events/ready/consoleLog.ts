import type { Client } from 'discord.js';
import { ensureEnv } from '../../utils/envValidator';
import { colours, emojis } from '../../utils/logger';

module.exports = (client: Client) => {
    if (client.user) {
        console.log(colours.green, `[${emojis.success}] Logged in with ${client.user.tag}`);
    } else {
        console.log(colours.red, `[${emojis.error}] Client user is null`, colours.reset);
        process.exit(1);
    }

    const guildId = ensureEnv('GUILD_ID');
    if (!client.guilds.cache.some(guild => guild.id === guildId)) {
        console.log(colours.red, `[${emojis.error}] A server with this ID "${guildId}" cannot be found in bot guilds`, colours.reset);
        process.exit(1);
    }
};
