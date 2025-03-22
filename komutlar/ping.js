const { EmbedBuilder,Client,CommandInteraction } = require("discord.js");
module.exports = {
    name:"ping",
    description: 'The delay value of the bot',
    description_localizations:{
        "tr":"Botun gecikme Değeri"
    },
    options:[],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {

     const embed = new EmbedBuilder()
     .setTitle(`:ping_pong: Pong! ${client.ws.ping}ms!`)

     if(client.ws.ping < 60) embed.setColor("Green")
     else if(client.ws.ping > 60 && client.ws.ping < 120) embed.setColor("Yellow")
     else if(client.ws.ping > 120) embed.setColor("Red")
     interaction.reply({embeds:[embed]}); 
}
};