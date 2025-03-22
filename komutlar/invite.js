const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { EmbedBuilder,Client,CommandInteraction } = require("discord.js");
const { t } = require("i18next");
const data = require("../models/guild");
module.exports = {
    name:"invite",
    description: 'Bot invite link',
    name_localizations: { "tr": "davet" },
    description_localizations:{
        "tr":"Botun Davet Link"
    },
    options:[],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        // const { dil } = await data.findOne({ GuildID: interaction.guild.id })||{ dil: "en-US"};
        const dil = interaction.locale;
     const embed = new MessageEmbed()
     .setTitle(`<:r_link:971472506621935706> ${t(`embed.invite.title`,{lng:dil})}`)
     .setDescription(`**[${t(`embed.invite.basbana`,{lng:dil})}](https://discord.com/api/oauth2/authorize?client_id=710115789537017926&permissions=8&scope=bot%20applications.commands)**`);
     interaction.reply({embeds:[embed],
        components:[
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(`${t(`button.invite`,{lng:dil})}!`)
                .setStyle("LINK").setEmoji("<:r_paylas:971472506974269581>")
                .setURL("https://discord.com/api/oauth2/authorize?client_id=710115789537017926&permissions=8&scope=bot%20applications.commands")
                )
            ]
        }); 
}
};