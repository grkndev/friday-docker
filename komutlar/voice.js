const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
const { t } = require("i18next");
const data = require("../models/guild");
module.exports = {
  name: "voice",
  description: "Audio channel settings",
  description_localizations: {
    tr: "Sesli kanal ayarları",
  },
  options: [
    {
      name: "set",
      name_localizations: { tr: "ayarla" },
      description: "Your custom channel system settings",
      description_localizations: { tr: "Özel kanal sistemini ayarlarsınız" },
      type: 2,
      options: [
        {
          name: "close",
          name_localizations: { tr: "kapat" },
          description: "You turn off the private channel system",
          description_localizations: {
            tr: "Özel kanal sistemini kapatırsınız",
          },
          type: 1,
        },
        {
          name: "open",
          name_localizations: { tr: "aç" },
          description_localizations: { tr: "Özel kanal sistemini açarsınız" },
          description: "You turn on the private channel system",
          type: 1,
          options: [
            {
              name: "channel",
              name_localizations: { tr: "kanal" },
              description: "join and create channel",
              description_localizations: { tr: "katıl ve oluştur kanalı" },
              type: 7,
              channel_types: [2],
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "name",
      name_localizations: { tr: "ad" },
      description_localizations: { tr: "Sesli odanın adını değiştirir" },
      description: "The change Voice channel name",
      options: [
        {
          name: "name",
          name_localizations: { tr: "ad" },
          description_localizations: { tr: "Yeni sesli kanal adı" },
          description: "New voice channel name",
          type: 3,
          required: true,
          min_length: 1,
          max_length: 22,
        },
      ],
      type: 1,
    },
    {
      name: "limit",
      description: "Sets the audio channel user limit",
      description_localizations: {
        tr: "Sesli kanal kullanıcı limitini ayarlar",
      },
      options: [
        {
          name: "value",
          description: "Voice channel user limit (0 REMOVE THE LIMIT!)",
          description_localizations: {
            tr: "Sesli kanal kullanıcı limiti (0 LİMİTİ KALDIRIR!)",
          },
          type: 4,
          min_value: 0,
          max_value: 99,
          required: true,
        },
      ],
      type: 1,
    },
    {
      name: "invite",
      name_localizations: { tr: "davet" },
      description_localizations: {
        tr: "Seçtiğiniz kişiyi sesli kanala davet eder",
      },
      description: "Invite the person of your choice to the voice channel",
      options: [
        {
          name: "user",
          description: "Person to be invited",
          name_localizations: { tr: "kişi" },
          description_localizations: { tr: "Davet edilecek kişi" },
          type: 6,
          required: true,
        },
      ],
      type: 1,
    },
    {
      name: "public",
      description: "toggle for all",
      name_localizations: { tr: "genel" },
      description_localizations: {
        tr: "Kanalı herkesi açık/kapalı hale getirir",
      },
      options: [
        {
          name: "value",
          description: "Channel status",
          name_localizations: { tr: "durum" },
          description_localizations: { tr: "Kanalın durumu" },
          type: 3,
          required: true,
          choices: [
            {
              name: "open",
              name_localizations: { tr: "Açık" },
              value: "true",
            },
            {
              name: "close",
              name_localizations: { tr: "Kapalı" },
              value: "false",
            },
          ],
        },
      ],
      type: 1,
    },
    {
      name: "kick",
      //name_localizations: { "tr": "at" },
      description_localizations: { tr: "Belirtilen kişiyi kanaldan atar" },
      description: "Kicks specified person from channel",
      options: [
        {
          name: "user",
          name_localizations: { tr: "kullanıcı" },
          description_localizations: { tr: "Kanaldan atılacak kullanıcı" },
          description: "user to be kicked from channel",
          type: 6,
          required: true,
        },
      ],
      type: 1,
    },
    {
      name: "ban",
      description: "ban specified person from channel",
      name_localizations: { tr: "yasakla" },
      description_localizations: {
        tr: "Belirtilen kişiyi kanaldan uzaklaştırır",
      },
      options: [
        {
          name: "user",
          description: "User to be removed from channel",
          name_localizations: { tr: "kullanıcı" },
          description_localizations: {
            tr: "Kanaldan uzaklaştırılacak kullanıcı",
          },
          type: 6,
          required: true,
        },
      ],
      type: 1,
    },
    {
      name: "unban",
      description: "It will be unban in the specified channel",
      name_localizations: { tr: "yasak-kaldır" },
      description_localizations: {
        tr: "Kanaldan yasağı kaldırılacak kullanıcı",
      },
      options: [
        {
          name: "user",
          description: "User to be removed",
          name_localizations: { tr: "kullanıcı" },
          description_localizations: {
            tr: "Kanaldan yasağı kaldırılacak kullanıcı",
          },
          type: 6,
          required: true,
        },
      ],
      type: 1,
    },
    {
      name: "claim",
      description: "You Own the Channel",
      name_localizations: { tr: "sahiplen" },
      description_localizations: { tr: "Kanalı Sahiplenirsiniz" },
      options: [],
      type: 1,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const dil = interaction.locale;
    // const { dil } = await data.findOne({ GuildID: interaction.guild.id })||{ dil: "en-US"};
    const sys = require("../models/guild");
    const model = require("../models/voice");
    const sbc = interaction.options.getSubcommand();

    switch (sbc) {
      case "open": {
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            embeds: [{ description: t("embed.yetkinYok", { lng: dil }) }],
            ephemeral: true,
          });

        const chl = interaction.options.getChannel("channel");
        const seg = new sys({
          GuildID: interaction.guild.id,
          SysDurum: true,
          j2tChannelId: chl.id,
        });
        seg.save();
        return interaction.reply({
          embeds: [{ description: t("voice.aktif", { lng: dil, chl }) }],
        });
      }
      case "close": {
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            embeds: { description: t("embed.yetkinYok", { lng: dil }) },
            ephemeral: true,
          });

        await sys.deleteOne({ GuildID: interaction.guild.id });
        return interaction.reply({
          embeds: [{ description: t("voice.pasif", { lng: dil }) }],
          ephemeral: true,
        });
      }
    }
    const { SysDurum } = (await sys.findOne({ GuildID: interaction.guild.id }))
      ? await sys.findOne({ GuildID: interaction.guild.id })
      : { SysDurum: false };
    if (SysDurum == false)
      return interaction.reply({
        embeds: [{ description: t("voice.zatenKapalı", { lng: dil }) }],
        ephemeral: true,
      });
    const voiceCh = interaction.member.voice.channel;
    if (!voiceCh)
      return interaction.reply({
        embeds: [{ description: t("voice.sesliKanalagir", { lng: dil }) }],
      });

    const { channelId, memberId, owner } = (await model.findOne({
      channelId: voiceCh.id,
    }))
      ? await model.findOne({ channelId: voiceCh.id })
      : { channelId: null, memberId: null };

    switch (sbc) {
      case "name": {
        if (voiceCh.id !== channelId) {
          return interaction.reply({
            embeds: [{ description: t("voice.burdaOlmaz", { lng: dil }) }],
            ephemeral: true,
          });
        }
        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ManageChannels
          ) &&
          interaction.member.id !== owner
        ) {
          interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
          return;
        }
        const newName = interaction.options.getString("name");
        if (newName.length > 22 || newName.length < 1)
          return interaction.reply({
            fetchReply: true,
            embeds: [
              new EmbedBuilder()
                .setDescription(t("voice.kanalAd", { lng: dil }))
                .setColor("Red"),
            ],
          });

        voiceCh.edit({ name: `${newName}` });
        await interaction.reply({
          fetchReply: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(t("voice.kanalAdOk", { lng: dil, newName }))
              .setColor("Green"),
          ],
        });
        break;
      }

      case "limit": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        let newLimit = interaction.options.getInteger("value");
        if (newLimit < 0) newLimit = 0; //return interaction.reply({embeds:[new EmbedBuilder().setDescription("Kanal kullanıcı limiti 0'dan küçük olamaz").setColor("RED")]});
        if (newLimit > 99) newLimit = 99; // return interaction.reply({embeds:[new EmbedBuilder().setDescription("Kanal kullanıcı limiti 99'dan büyük olamaz").setColor("RED")]});
        voiceCh.edit({ userLimit: newLimit });
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(t("voice.limitDegis", { lng: dil, newLimit }))
              .setColor("Green"),
          ],
        });
        break;
      }

      case "invite": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        const user = interaction.options.getMember("user");
        if (user.id === interaction.member.id)
          return interaction.reply({
            embeds: [{ description: "You can't invite yourself" }],
            ephemeral: true,
          });
        voiceCh.permissionOverwrites.edit(user.id, {
          Connect: true,
          Speak: true,
          Stream: true,
          UseVAD: true,
          ViewChannel: true,
        });
        interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              t("voice.davetEdildi", { lng: dil, user })
            ),
          ],
        });
        try {
          await user.send({
            embeds: [
              {
                description: t("voice.davetEdildin", {
                  lng: dil,
                  adam: interaction.member,
                  chl: voiceCh,
                }),
              },
            ],
          });
        } catch (e) {
          () => {};
        }
        break;
      }

      case "public": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        const status = interaction.options.getString("value");
        if (status == "true") {
          voiceCh.permissionOverwrites.edit(interaction.guild.id, {
            Connect: true,
            Speak: true,
            Stream: true,
            UseVAD: true,
            ViewChannel: true,
          });
          interaction.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                t("voice.herkeseAcik", { lng: dil })
              ),
            ],
          });
        } else {
          voiceCh.permissionOverwrites.edit(interaction.guild.id, {
            Connect: false,
            Speak: false,
            Stream: false,
            UseVAD: false,
          });
          interaction.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                t("voice.herkeseKapali", { lng: dil })
              ),
            ],
          });
        }
        break;
      }

      case "kick": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        const user = interaction.options.getMember("user");
        const id = user.voice.channel ? user.voice.channel.id : null;

        if (user.id === interaction.member.id)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(t("voice.kendindeYapma", { lng: dil }))
                .setColor("Red"),
            ],
          });

        if (id !== voiceCh.id)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(t("voice.adamBaskaYerde", { lng: dil }))
                .setColor("Red"),
            ],
          });

        user.voice.disconnect();
        interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              t("voice.kickYedi", { lng: dil, user })
            ),
          ],
        });
        break;
      }

      case "ban": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        const user = interaction.options.getMember("user");
        if (user.id === interaction.member.id)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(t("voice.kendindeYapma", { lng: dil }))
                .setColor("Red"),
            ],
          });

        const id = user.voice.channel ? user.voice.channel.id : null;
        if (id !== voiceCh.id)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(t("voice.adamBaskaYerde", { lng: dil }))
                .setColor("Red"),
            ],
          });
        voiceCh.permissionOverwrites.edit(user.id, {
          Connect: false,
          Speak: false,
          Stream: false,
          UseVAD: false,
          ViewChannel: false,
        });
        user.voice.disconnect();
        interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              t("voice.banYedi", { lng: dil, user })
            ),
          ],
        });
        break;
      }
      case "unban": {
        if (
          (!channelId || channelId !== voiceCh.id) &&
          (interaction.member.id !== owner ||
            interaction.member.id !== interaction.guild.ownerId)
        )
          return interaction.reply({
            embeds: [{ description: t("voice.sahipDegil", { lng: dil }) }],
            ephemeral: true,
          });
        const user = interaction.options.getMember("user");
        if (user.id === interaction.member.id)
          return interaction.reply(t("voice.kendindeYapma", { lng: dil }));
        voiceCh.permissionOverwrites.edit(user.id, {
            'Connect': true,
            'Speak': true,
            'Stream': true,
            'UseVAD': true,
            'ViewChannel': true,
        });
        interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              t("voice.unbanYedi", { lng: dil, user })
            ),
          ],
        });
        break;
      }
      case "claim": {
        const r = require("../models/request.js");
        if (!owner) {
          await model.updateOne(
            { channelId: voiceCh.id },
            { memberId: interaction.member.id, owner: interaction.member.id }
          );
          interaction.reply({
            embeds: [{ description: t("voice.sahiplendi", { lng: dil }) }],
          });
          return;
        }
        if (interaction.member.id == owner)
          return interaction.reply({
            embeds: [{ description: t("voice.zatenSahip", { lng: dil }) }],
            ephemeral: true,
          });
        interaction.reply({
          embeds: [{ description: t("voice.sahiplenmeMesaj", { lng: dil }) }],
        });
        try {
          interaction.guild.members.cache.get(memberId).send({
            embeds: [
              new EmbedBuilder().setDescription(
                t("voice.sahipDM", {
                  lng: dil,
                  user: interaction.member,
                  chl: voiceCh,
                })
              ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel(t("button.kabul", { lng: dil }))
                  .setStyle("Success")
                  .setCustomId("kabuledildi"),
                new ButtonBuilder()
                  .setLabel(t("button.red", { lng: dil }))
                  .setStyle("Danger")
                  .setCustomId("reddet")
              ),
            ],
          });
          await r.updateOne(
            { kanalId: voiceCh.id },
            { guildId: interaction.guild.id, isteyen: interaction.member.id },
            { upsert: true }
          );
        } catch(err) {
          interaction.channel.send({
            embeds: [{ description: `${t("voice.mesajGitmoo", { lng: dil })}\n${err}` }],
          });
        }
        break;
      }
    }
  },
};
