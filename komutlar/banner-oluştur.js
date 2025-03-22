const {
  EmbedBuilder,
  AttachmentBuilder,
  Client,
  CommandInteraction,
} = require("discord.js");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
module.exports = {
  name: "banner-oluştur",
  description: "Banner Banner oluşturur",
  options: [
    { name: "text", description: "Bannerın yazısı", type: 3, required: true },
    {
      name: "font",
      description: "Yazının fontu",
      type: 3,
      choices: [
        { name: "Ginto Nord", value: "ABC Ginto Nord Unlicensed Trial" },
        { name: "Akira Expanded", value: "Akira Expanded" },
      ],
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: "Bannerınız oluşturuluyor lütfen bekleyiniz...",
    });
    let tezt = interaction.options.getString("text");
    let font = interaction.options.get("font")?.value || "Akira Expanded";
    if (tezt.length > 32)
      return interaction.editReply({
        content: "En fazla 32 karakter girebilirsiniz.",
      });
   // console.log(GlobalFonts.families);
    // Create a new canvas
    const canvas = createCanvas(1902, 671);
    const context = canvas.getContext("2d");
    // set background image
    const background = await loadImage("./back.png");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    //#region ApplText
    //function to create canvas
    const applyText = (canvas, text) => {
      const context = canvas.getContext("2d");

      // Declare a base size of the font
      let fontSize = 110;

      do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${(fontSize -= 10)}px ${font}`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
      } while (context.measureText(text).width > canvas.width - 300);

      // Return the result to use in the actual canvas
      return context.font;
    };
    //#endregion
    // set text
    context.font = applyText(canvas, tezt);
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText(tezt, canvas.width / 2, canvas.height / 1.8);

    // send canvas
    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
      name: "profile-image.png",
    });
    interaction.editReply({ content: "bannerınız", files: [attachment] });
  },
};
