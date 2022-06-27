const Canvas = require("canvas");
const { CanvasSenpai } = require("canvas-senpai");
const jimp = require("jimp");
const { getAverageColor } =  require('fast-average-color-node');
module.exports.run = () => {
  CanvasSenpai.prototype.profile = async function ({
    name,
    discriminator,
    avatar,
    rank,
    xp,
    background,
    cardLight,
    cardDark,
    blur = true,
  } = {}) {
    if (!name) throw new Error("profile name is not given");
    if (!avatar) throw new Error("Avatar image url is not given");
    if (!rank) throw new Error("Rank is not given.");
    if (!xp) throw new Error("Xp is not given.");
    let color = await getAverageColor(
      background ? background : __dirname + "/images/erased.png"
    );
    if (!color.hex) color.hex = "black";
    else color = color;

   
    const canvas = Canvas.createCanvas(740, 259);
    const ctx = canvas.getContext("2d");

    if (blur) {
      background = await jimp.read(
        background ? background : __dirname + "/images/erased.png"
      );
      background.blur(5);
      let image = await background.getBufferAsync("image/png");
      image = await Canvas.loadImage(image);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      let image = await Canvas.loadImage(
        background ? background : __dirname + "/images/erased.png"
      );
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = cardLight ? cardLight : color.hex;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(43, 0, 170, 300);
    ctx.globalAlpha = 1;

    avatar = await jimp.read(avatar);
    avatar.resize(1024, 1024);
    avatar.circle();
    let raw = await avatar.getBufferAsync("image/png");
    avatar = await Canvas.loadImage(raw);
    ctx.drawImage(avatar, 53, 15, 150, 150);

    ctx.fillStyle = color.hex;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(53, 180, 150, 30);
    ctx.fillRect(53, 220, 150, 30);
    ctx.fillRect(
      720 - (name.length >= 29 ? 29 * 12 : name.length * 12.5),
      13.5,
      400,
      30
    );
    ctx.fillRect(650, 50, 200, 25);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "white";
    ctx.font = `20px Bold`;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.8;
    ctx.fillText("RANK : #" + rank, 125, 202);
    ctx.globalAlpha = 1;

    ctx.font = `bold 20px Bold`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#f5f5f5";
    ctx.globalAlpha = 0.8;
    ctx.fillText("XP : " + xp, 126, 242);
    ctx.globalAlpha = 1;

    ctx.font = `bold 20px Manrope`;
    name = name.length > 29 ? name.substring(0, 29).trim() + ".." : name;
    ctx.textAlign = "right";
    ctx.fillText(`${name}`, 730, 35);
    ctx.fillText(`#${discriminator}`, 730, 69.5);

    return canvas.toBuffer();
  };
};
