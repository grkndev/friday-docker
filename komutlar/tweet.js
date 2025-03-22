const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  AttachmentBuilder
} = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { readFile } = require("fs/promises");
const { request } = require("undici");
/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = {
  name: "tweet",
  description: "Sends tweets",
  options: [
    {
      name: "tweet-content",
      description: "Tweet Content",
      required: true,
      type: ApplicationCommandOptionType.String,
      min_length: 5,
      max_length: 275,
    }
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    const username = interaction.member.user.username;
    const content = interaction.options.getString("tweet-content");
    const like = "93,4 B";
    const retweet = "57,4 B";
    const quote = "33,1 B";
    await interaction.reply("Generating Tweet...");

    try {
      const canvas = Canvas.createCanvas(700, 350);
      const context = canvas.getContext("2d");
      const backgroundFile = await readFile("./back1.png");
      const badgeFile = await readFile("./badge.png");
      const background = new Canvas.Image();
      background.src = backgroundFile;

      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#2f3336";
      context.strokeRect(0, 0, canvas.width, canvas.height);


      /// AD SOYAD
      context.font = userText(canvas, `${username}`);
      context.fillStyle = "#ffffff";
      context.fillText(`${username}`, canvas.width / 8, canvas.height / 7);
      /// KULLANICI ADI
      context.font = "200 13px sans-serif";
      context.fillStyle = "#656c72";
      context.fillText(`@${username.replace(' ','')}`, canvas.width / 8, canvas.height / 5.3);
      /// AÇIKLAMA
      context.font = `300 30px sans-serif`; //applyText(canvas, `${content}`);
      context.fillStyle = "#ffffff";
      wrapText(context, content, 25, 120, 680, 30);
      /// RETWEET
      context.font = "200 18px sans-serif";
      context.fillStyle = "#fff";
      context.fillText(`${retweet}`, 45, 265);
      /// quote
      context.font = "200 18px sans-serif";
      context.fillStyle = "#fff";
      context.fillText(`${quote}`, 285, 265);
      /// like
      context.font = "200 18px sans-serif";
      context.fillStyle = "#fff";
      context.fillText(`${like}`, 520, 265);

      const { body } = await request(
        interaction.user.displayAvatarURL({ extension: "jpg" })
      );

        /// ROZET
      const badge = new Canvas.Image();
      badge.src = badgeFile;
      context.drawImage(badge, 245, 33.4, 20, 20);

      /// AVATAR
      context.beginPath();
      context.arc(50, 50, 25, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      const avatar = new Canvas.Image();
      avatar.src = Buffer.from(await body.arrayBuffer());
      context.drawImage(avatar, 20, 20, 55, 55);

      const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
        name: "tweet.png",
      });
      interaction.editReply({ content: "", files: [attachment] });
    } catch (err) {
      interaction.editReply({ content: "bir hata oluştu\n" + err });
    }
  },
};
const userText = (canvas, text) => {
  const context = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 22;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `700 ${(fontSize -= 2)}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 500);

  // Return the result to use in the actual canvas
  return context.font;
};

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 450;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `300 ${(fontSize -= 10)}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 20);

  // Return the result to use in the actual canvas
  return context.font;
};
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  context.fillStyle = "#fff";
  text = text

    .replace(/#([\wşçöğüıİ]+)/gi, "#$1")
    .replace(
      /(https?:\/\/[\w\.\/?=]+)/,
      `$1`
    )
    .replace(
      /@([\w]+)/,
      '@$1'
    );
  var words = text.split(' ');
  var line = '';
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
const tweetFormat = (tweet) => {
  
  tweet = tweet

    .replace(/#([\wşçöğüıİ]+)/gi, "#$1")
    .replace(
      /(https?:\/\/[\w\.\/?=]+)/,
      `$1`
    )
    .replace(
      /@([\w]+)/,
      '@$1'
    );
    context.fillText(tweet, x, y);
};