import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription("اضهار سرعة اتصال البوت");

export async function execute(client, interaction) {
    let PingEmb = new EmbedBuilder()
    .setTitle("Ping")
    .setDescription("سرعة اتصال البوت في الخادم")
    .addFields(
        {
            name: "سرعة اتصال خادم ديسكورد :",
            value: `${client.ws.ping}ms`
        }
    )
    .setThumbnail(interaction.guild.iconURL())
    .setColor("#f0be2b");
    interaction.reply({ embeds: [PingEmb] });
}