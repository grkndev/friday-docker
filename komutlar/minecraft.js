const {
  EmbedBuilder,
  Client,
  CommandInteraction,
  ApplicationCommandOptionType,
  ButtonBuilder,
} = require("discord.js");
const {
  getSkin,
  getCape,
  getServer,
  getBody,
  getHead,
} = require("@mineapi/sdk");
const { ActionRowBuilder } = require("discord.js");
const { t } = require("i18next");
module.exports = {
  name: "minecraft",
  description: "Shows the minecraft information of the player you specified",
  description_localizations: {
    tr: "Belirttiğiniz oyuncunun minecraft bilgilerini gösterir",
  },
  options: [
    {
      name: "skin",
      description: "Shows the skin of the player you specified",
      description_localizations: {
        tr: "Belirttiğiniz oyuncunun skinini gösterir",
      },
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "username",
          description: "The username of the player",
          description_localizations: { tr: "Kullanıcı adı" },
          required: true,
          type: ApplicationCommandOptionType.String,
          min_length: 1,
          max_length: 16,
        },
      ],
    },
    {
      name: "cape",
      description: "Shows the cape of the player you specified",
      description_localizations: {
        tr: "Belirttiğiniz oyuncunun pelrinini gösterir",
      },
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "username",
          description: "The username of the player",
          description_localizations: { tr: "Kullanıcı adı" },
          required: true,
          type: ApplicationCommandOptionType.String,
          min_length: 1,
          max_length: 16,
        },
      ],
    },
    {
        name: "server",
        description: "Shows the information of the server you specified",
        description_localizations: {
          tr: "Belirttiğiniz sunucunun bilgilerini gösterir",
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "server-ip",
            description: "The username of the player",
            description_localizations: { tr: "sunucu-ipsi" },
            required: true,
            type: ApplicationCommandOptionType.String,
            min_length: 1
          },
        ],
      },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({ embeds: [{ description: "Fetching..." }] });
    const embed = new EmbedBuilder();
    const dil = interaction.locale;
   
   
    let subCmd = interaction.options.getSubcommand();
    switch (subCmd) {
      case "skin": {
        let body, head, skin;
        try {
            body = await getBody(interaction.options.getString("username"));
            console.log(body);
            head = await getHead(interaction.options.getString("username"));
            skin = await getSkin(interaction.options.getString("username"));
          } catch (e) {
            return interaction.editReply({
              embeds: [{ description: t("minecraft.bulunamadı", { lng: dil }) }],
            });
          }
        embed
          .setTitle(t("minecraft.skin", { lng: dil, user: interaction.options.getString("username") }))
		  .setDescription(t("minecraft.skinB", { lng: dil }))
          .setImage(body)
          .setFooter({
            text: `Requested by ${interaction.member.user.tag}`,
            iconURL: interaction.member.user.displayAvatarURL(),
          });
        interaction.editReply({
          embeds: [embed],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setLabel(t("minecraft.indir", { lng: dil }))
                .setStyle("Link")
                .setURL(skin)
            ),
          ],
        });
        break;
      }
      case "server":{

       try{
        let server = await getServer(interaction.options.getString("server-ip")) || null;
        if(!server) return interaction.editReply({embeds:[{description:"server not found"}]});
        embed.setTitle(`${interaction.options.getString("server-ip")}'s Server`)
        .addFields([
            { name: "Server Host", value: `${interaction.options.getString("server-ip")}`, inline: true },
            { name: "Server IP", value: `${server.ip}`, inline: true },
            { name: "Server Port", value: `${server.port}`, inline: true },
            { name: "Server Version", value: `${server.version}`, inline: true },
            { name: "Server Status", value: `${server.online}`, inline: true },
            { name: "Server Players", value: `${server.players.online}/${server.players.max}`, inline: true },
        ])
        .setFooter({text:`Requested by ${interaction.member.user.tag}`,iconURL:interaction.member.user.displayAvatarURL()})
        .setThumbnail(`${server.icon}`)
        .setImage(`https://api.mineapi.me/v1/motd/${interaction.options.getString("server-ip")}`);
        interaction.editReply({embeds:[embed]});
       }
       catch{
        interaction.editReply({embeds:[{description:"server not found"}]});
       }
        break;
      }
      case "cape":{
        let cape ;
       try
        {
          cape = await getCape(interaction.options.getString("username"),"optifine") || null;
        }
       catch{
        return interaction.editReply({embeds:[{description:t("minecraft.capeYok", { lng: dil })}]});
       }
        if(!cape) return interaction.editReply({embeds:[{description:t("minecraft.capeYok", { lng: dil })}]});
        embed.setTitle(t("minecraft.cape", { lng: dil, user: interaction.options.getString("username") }))
        .setImage(cape)
        .setFooter({text:`Requested by ${interaction.member.user.tag}`,iconURL:interaction.member.user.displayAvatarURL()});
        interaction.editReply({embeds:[embed]});
        break;
      }
    }
  },
};
