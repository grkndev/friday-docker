const { REST } = require("@discordjs/rest");
const mongoose = require("mongoose");
const fs = require("fs");

const {
  Client,
  Collection,
  VoiceState,
  Routes,
  ModalBuilder,
  ChannelType,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");
const client = new Client({ intents: 723 });
const {
  testDB,
  testToken,
  mongoDB,
  token,
  dev,
  testId,
  botId,
  voteToken,
} = require("./ayarlar.json");
const i18next = require("i18next");
const trnsBackend = require("i18next-fs-backend");

i18next.use(trnsBackend).init({
  ns: "cmd",
  defaultNS: "cmd",
  fallbackLng: "en-US",
  preload: fs.readdirSync("./lang"),
  backend: {
    loadPath: "./lang/{{lng}}/{{ns}}.json",
  },
});
mongoose
  .connect(dev ? testDB : mongoDB)
  .then(() => console.log("MongoDB Bağlantısı Başarılı"))
  .catch((e) => console.log("MongoDB Bağlantısı Başarısız, Hata: " + e));

client.j2c = new Collection();
global.client = client;

client.commands = global.commands = [];
fs.readdir("./komutlar/", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./komutlar/${file}`);

    client.commands.push({
      name: props.name.toLowerCase(),
      description: props.description,
      options: props.options,
      type: 1,
      dm_permission: false,
    });
    console.log(`\u001b[1;32m👌 Slash Komut Yüklendi: ${props.name}\u001b[0m`);
  });
});
fs.readdir("./events/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    console.log(`\u001b[1;35m📘 Event yüklendi: ${eventName}\u001b[0m`);
    client.on(eventName, (...args) => {
      event(client, ...args);
    });
  });
});
/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */

client.on("guildDelete", async (guild) => {
  const sys = require("./models/guild");
  await sys.deleteOne({ GuildID: guild.id });
});
client.on("voiceStateUpdate", async (oldState, newState) => {
  const sys = require("./models/guild");
  const model = require("./models/voice");
  const { SysDurum, j2tChannelId } = (await sys.findOne({
    GuildID: newState.guild.id,
  }))
    ? await sys.findOne({ GuildID: newState.guild.id })
    : { SysDurum: false, j2tChannelId: null };
  if (SysDurum == false) return;

  const { member, guild } = newState;
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const jtc = j2tChannelId;
  const { channelId, memberId } = (await model.findOne({
    channelId: oldChannel?.id,
  }))
    ? await model.findOne({ channelId: oldChannel.id })
    : { channelId: null };
  if (
    oldChannel &&
    channelId &&
    oldChannel.id === channelId &&
    (!newChannel || newChannel.id !== channelId)
  ) {
    if (oldChannel.members.size == 0) {
      try {
        await oldChannel.delete();
        await model.deleteOne({ channelId: oldChannel.id });
        return;
      } catch {}
    }
    if (!oldChannel.members.has(memberId))
      return await model.updateOne(
        { channelId: oldChannel.id },
        { owner: null }
      );
  }
  if (newChannel && oldChannel !== newChannel && newChannel.id === jtc) {
    const voiceChannel = await guild.channels.create({
      name: `${member.user.tag}`,
      type: ChannelType.GuildVoice,
      userLimit: 3,
      reason: `${member.user.tag} için özel oda oluşturuldu | Friday Bot Özel Oda Sistemi`,
      parent: newChannel.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.UseVAD,
          ],
        },
        { id: guild.id, deny: [PermissionFlagsBits.Connect] },
      ],
    });
    new model({
      memberId: member.id,
      channelId: voiceChannel.id,
      owner: member.id,
    }).save();
    client.j2c.set(member.id, voiceChannel.id);
    return member.voice.setChannel(voiceChannel);
  }
});
client.on("ready", async () => {
  client.user.setStatus("idle"),
    client.user.setActivity("Join 2 Create!", { type: "WATCHING" });
  const rest = new REST({ version: "10" }).setToken(dev ? testToken : token);
  try {
    await rest.put(Routes.applicationCommands(dev ? testId : botId), {
      body: commands,
    });
  } catch (error) {
    console.error(error);
  }
});
client.login(dev ? testToken : token).then(() => {
  dev ? console.log("\u001b[1;33m[ LOGINED DEVELOPMENT MODE ]\u001b[0m") : console.log("\u001b[1;36m[ LOGINED PRODUCTION MODE ]\u001b[0m");
  console.log(`Logined ${client.user.tag}`);
});
