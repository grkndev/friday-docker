const {
  Client,
  CommandInteraction,
  InteractionType,
  ButtonBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const fs = require("fs");
// const { ModalBuilder, ModalField } = require("discord-modal");
const { t } = require("i18next");
/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    try {
      fs.readdir("./komutlar/", (err, files) => {
        if (err) throw err;

        files.forEach(async (f) => {
          const command = require(`../komutlar/${f}`);
          if (
            interaction.commandName.toLowerCase() === command.name.toLowerCase()
          ) {
            return command.run(client, interaction);
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (interaction.isButton()) {
    const { customId, user, client } = interaction;
    if (customId == "thanks") {
    }
    if (customId == "info") {
      const textinput = new ModalBuilder()
        .setCustomId("req")

        .setTitle(t("modal.istek.formTitle", { lng: interaction.locale }));
      const textinput1 = new TextInputBuilder()
        .setLabel(t("modal.istek.baslikLabel", { lng: interaction.locale }))
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(
          t("modal.istek.baslikHolder", { lng: interaction.locale })
        )
        .setCustomId("title_1")
        .setMinLength(5)
        .setRequired(true);

      const textinput2 = new TextInputBuilder()
        .setLabel(t("modal.istek.desLabel", { lng: interaction.locale }))
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(15)
        .setPlaceholder(
          t("modal.istek.desLholder", { lng: interaction.locale })
        )
        .setCustomId("desc_1")
        .setRequired(true);

        // const input3 = new SelectMenuBuilder()
        // .setCustomId("type_1")
        // .setPlaceholder("seç")
        // .setOptions([{label:"deneme",value:"asd"},{label:"deneme2",value:"asd2"}])

        const Inpt1 = new ActionRowBuilder().addComponents(textinput1);
        const Inpt2 = new ActionRowBuilder().addComponents(textinput2);
        // const Inpt3 = new ActionRowBuilder().addComponents(input3);
     
      textinput.addComponents(Inpt1,Inpt2);
      await interaction.showModal(textinput);
      // client.modal.open(interaction, textinput)
      return;
    }

    if (customId == "report") {
      const textinput = new ModalBuilder()
        .setCustomId("buglar")
        .setTitle(t("modal.bug.formTitle", { lng: interaction.locale }))
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel(t("modal.bug.baslikLabel", { lng: interaction.locale }))
              .setStyle(TextInputStyle.Short)
              .setPlaceholder(
                t("modal.bug.baslikHolder", { lng: interaction.locale })
              )
              .setCustomId("komuttadı")
              .setMinLength(5)
              .setRequired(true),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel(t("modal.bug.desLabel", { lng: interaction.locale }))
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(15)
              .setPlaceholder(
                t("modal.bug.desLholder", { lng: interaction.locale })
              )
              .setCustomId("des_bug")
              .setRequired(true)
          )
        );

      interaction.showModal(textinput);
      return;
    }

    const model = require("../models/voice");
    const r = require("../models/request");

    const { channelId } = (await model.findOne({ memberId: user.id }))
      ? await model.findOne({ memberId: user?.id })
      : { channelId: null };
    if (!channelId)
      return await interaction.reply({ content: "Aktifive bulunamadı" });
    const { guildId, kanalId, isteyen } = await r.findOne({
      kanalId: channelId,
    });

    if (customId == "kabuledildi") {
      await model.updateOne(
        { memberId: user.id },
        { owner: isteyen, memberId: isteyen }
      );
      interaction.update({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel(`${t("button.kabuled", { lng: interaction.locale })}`)
              .setStyle("Success")
              .setCustomId("onayke")
              .setDisabled(true)
          ),
        ],
      });
      await client.guilds.cache
        .get(guildId)
        .members.cache.get(isteyen)
        .send({
          content: `Sahiplenme isteğiniz kabul edildi! artık <#${kanalId}> kanalının sahibisin!`,
        })
        .then(async () => {
          await r.deleteOne({ kanalId });
        })
        .catch(() => {});
    } else if (customId == "reddet") {
      interaction.update({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel(`${t("button.reded", { lng: interaction.locale })}`)
              .setStyle("Danger")
              .setCustomId("kesinred")
              .setDisabled(true)
          ),
        ],
      });
      client.guilds.cache
        .get(guildId)
        .members.cache.get(isteyen)
        .send({ content: `Sahiplenme isteğiniz reddedildi` })
        .then(async () => {
          await r.deleteOne({ kanalId });
        })
        .catch(() => {});
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId == "req") {
      const embed = new EmbedBuilder()
        .setTitle("Friday Suggestion/Complaint Form")
        .setDescription(
          `Sender: ${interaction.user.tag} | (${interaction.user.id})
        Request: Title: \`\`\`${interaction.fields.getTextInputValue(
          "title_1"
        )} \`\`\`\n
        Request: Description: \`\`\`${interaction.fields.getTextInputValue(
          "desc_1"
        )} \`\`\`
        `
        )
        .setThumbnail(
          interaction.user.avatarURL({ size: 1024, dynamic: true })
        );

      interaction.reply({
        content: "your request has been sent",
        ephemeral: true,
      });
      client.channels.cache
        .get("975122452562735144")
        .send({ embeds: [embed] /*,components:[row]*/ });
      return;
    }
    if (interaction.customId == "buglar") {
      const embed = new EmbedBuilder()
        .setTitle("Friday Bug Reporting Form")
        .setDescription(
          `Sender: ${interaction.user.tag} | (${interaction.user.id})
        Command: \`\`\`${interaction.fields.getTextInputValue(
          "komuttadı"
        )} \`\`\`\n
        Description: \`\`\`${interaction.fields.getTextInputValue(
          "des_bug"
        )} \`\`\`
        `
        )
        .setThumbnail(
          interaction.user.avatarURL({ size: 1024, dynamic: true })
        );

      interaction.reply({ content: "your bug has been sent", ephemeral: true });
      client.channels.cache.get("975122452562735144").send({ embeds: [embed] });
      return;
    }
  }
};
