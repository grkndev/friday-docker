const { ActionRowBuilder } = require("discord.js");
const { EmbedBuilder, ButtonBuilder, Client, CommandInteraction } = require("discord.js");
const { t } = require("i18next");
const data = require("../models/guild");
module.exports = {
    name: "help",
    description: 'Help Menu',
    name_localizations: { "tr": "yardım" },
    description_localizations: { "tr": "Botun Yardım menüsü" },
    options: [],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const dil = interaction.locale;
        // const { dil } = await data.findOne({ GuildID: interaction.guild.id }) || { dil: "en-US"};
        let s = true;
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`📘 Friday ${t("help.title", { lng: dil })}!`)

        for (i = 1; i < 15; i++) {
            embed
                .addFields({
                    name:`/${t(`help.c${i}.name`, { lng: dil })}`,
                    value:`${t(`help.c${i}.value`, { lng: dil })}`,
                    inline:s
                });
        } embed
            .setThumbnail(client.user.avatarURL({ size: 1024, dynamic: true }))
            .setFooter({
                text: `${t(`embed.footer`, { lng: dil, user: interaction.member.user.tag })} © 2022 Friday`,
                iconURL: interaction.member.user.avatarURL({ size: 1024, dynamic: true })
            })

        interaction.reply({
            embeds: [embed], components: [new ActionRowBuilder().setComponents(new ButtonBuilder()
                .setStyle("Link").setURL("https://top.gg/bot/710115789537017926/vote")
                .setLabel(t("button.vote", { lng: dil }))
                .setEmoji("<a:star5:761479712743620608>"))]
        });

    }
};