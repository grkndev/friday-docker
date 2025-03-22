const { ButtonBuilder } = require("discord.js");
const { EmbedBuilder, Client, CommandInteraction, ActionRowBuilder } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const { t } = require("i18next");
module.exports = {
    name: "info",
    description: 'information about the bot',
    name_localizations: { "tr": "istatistik" },
    description_localizations: { "tr": "Bot hakkında bilgiler" },
    options: [],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        // const { dil } = await data.findOne({ GuildID: interaction.guild.id })||{ dil: "en-US"};
        const dil = interaction.locale;
        const embed = new EmbedBuilder()
            .setTitle(`📊 ${client.user.username} ${t(`istatistik.title`, { lng: dil })}`)
            .addFields(
                { name:`<:r_tac:971472507272048670> ${t(`istatistik.c1`, { lng: dil })}`,value: `<@586822327568695317> | Gweep Creative#0001`,inline: true },
                { name:`<:r_ayarlar:971472505317503046> ${t(`istatistik.c2`, { lng: dil })}`,value: `\n**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}** MB`,inline: true },
                { name:`<:r_tac:971472507272048670> ${t(`istatistik.c3`, { lng: dil })}`,value: `\nDiscord.JS v14`,inline: true },
                { name:`<:r_kod:971472506441576468> ${t(`istatistik.c4`, { lng: dil })}`,value: `\n${client.ws.ping.toLocaleString()}ms`,inline: true },
                { name:`<:r_bot:971472505413967903> ${t(`istatistik.c5`, { lng: dil })}`,value: `\n${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,inline: true },
                { name:`<:r_goz:971472506139594762> ${t(`istatistik.c6`, { lng: dil })}`,value: `${client.guilds.cache.size}`,inline: true },
                { name:`<:r_ayarlar:971472505317503046> ${t(`istatistik.c7`, { lng: dil })}`,value: `${client.channels.cache.size.toLocaleString()}`,inline: true },
                { name:`<:r_ayarlar:971472505317503046> ${t(`istatistik.c8`, { lng: dil })}`,value: `${client.commands.size}`,inline: true },
                { name:`<:r_soru:971472507272048670> ${t(`istatistik.c9`, { lng: dil })}`,value: `\n**${prettyMilliseconds(client.uptime)}**`,inline: true },
                { name:`<:r_cevir:971472505300717599> ${t(`istatistik.c10.title`, { lng: dil })}`,value: `${t(`istatistik.c10.value`, { lng: dil })}`,inline: true },
                { name:`<:r_bug1:971472505174900777> ${t(`istatistik.c11`, { lng: dil })}`,value: `Gweep Creative#0001 — 189.658p`,inline: false },
                )

            .setThumbnail(client.user.avatarURL({ size: 1024, dynamic: true }))
            .setFooter({
                text: `${t(`embed.footer`,{lng: dil, user: interaction.member.user.tag})} © 2022 Friday`,
                iconURL: interaction.member.user.avatarURL({ size: 1024, dynamic: true })
            })
            .setColor("Yellow");
        interaction.reply(
            {
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle("Secondary").setCustomId("info")
                            .setLabel(t(`button.istek`, { lng: dil }))
                            .setEmoji("<:r_dikkat:971472505837609041>"),
                        new ButtonBuilder()
                            .setStyle("Secondary").setCustomId("report")
                            .setLabel(t(`button.bug`, { lng: dil }))
                            .setEmoji("<:r_bug:971472505506242560>"),
                        new ButtonBuilder()
                            .setStyle("Link").setURL("https://top.gg/bot/710115789537017926/vote")
                            .setLabel(t(`button.vote`, { lng: dil }))
                            .setEmoji("<a:star5:761479712743620608>")
                    )
                ]
            });

    }
};