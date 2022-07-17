const Canvas = require("canvas");
const { CanvasSenpai } = require("canvas-senpai");
const jimp = require("jimp");
const { getAverageColor } = require("fast-average-color-node");
module.exports.run = () => {
  CanvasSenpai.prototype.profile = async function ({
    name,
    discriminator,
    avatar,
    rank,
    level,
    maxxp,
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

    if (!background)
      if (Math.random() < 0.5)
        background =
          "https://media.discordapp.net/attachments/982536937996959784/990336044052385792/IMG_20220625_212119.jpg";
      else
        background =
          "https://media.discordapp.net/attachments/982536937996959784/990336044417302568/IMG_20220625_212043.jpg";
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
    ctx.fillText("LEVEL : " + level, 126, 242);
    ctx.globalAlpha = 1;

    ctx.font = `bold 20px Manrope`;
    name = name.length > 29 ? name.substring(0, 29).trim() + ".." : name;
    ctx.textAlign = "right";
    ctx.fillText(`${name}`, 730, 35);
    ctx.fillText(`#${discriminator}`, 730, 69.5);

    //Calculate xp precentage
    let xpPercent = Math.floor((xp / maxxp) * 100);
    ctx.globalAlpha = 0.8;

    progressbar = new progressBar(
      { x: (720 - 300) / 2 + 20, y: 200, width: 300, height: 20 },
      color.hex,
      xpPercent,
      ctx,
      `XP : ${xp}/${maxxp}`
    );
    progressbar.draw();
    return canvas.toBuffer();
  };
};

class progressBar {
  constructor(dimension, color, percentage, ctx, text) {
    ({ x: this.x, y: this.y, width: this.w, height: this.h } = dimension);
    this.color = color;
    this.percentage = percentage / 100;
    this.p;
    this.ctx = ctx;
    this.text = text;
  }

  static clear() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  draw() {
    // Visualize -------
    this.showWholeProgressBar();
    // -----------------
    this.p = this.percentage * this.w;
    if (this.p <= this.h) {
      this.ctx.beginPath();
      this.ctx.arc(
        this.h / 2 + this.x,
        this.h / 2 + this.y,
        this.h / 2,
        Math.PI - Math.acos((this.h - this.p) / this.h),
        Math.PI + Math.acos((this.h - this.p) / this.h)
      );
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.arc(
        this.h / 2 - this.p - this.x,
        this.h / 2 + this.y,
        this.h / 2,
        Math.PI - Math.acos((this.h - this.p) / this.h),
        Math.PI + Math.acos((this.h - this.p) / this.h)
      );
      this.ctx.restore();
      this.ctx.closePath();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(
        this.h / 2 + this.x,
        this.h / 2 + this.y,
        this.h / 2,
        Math.PI / 2,
        (3 / 2) * Math.PI
      );
      this.ctx.lineTo(this.p - this.h + this.x, 0 + this.y);
      this.ctx.arc(
        this.p - this.h / 2 + this.x,
        this.h / 2 + this.y,
        this.h / 2,
        (3 / 2) * Math.PI,
        Math.PI / 2
      );
      this.ctx.lineTo(this.h / 2 + this.x, this.h + this.y);
      this.ctx.closePath();
    }
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // Text -----------
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textAlign = "center";
    this.ctx.globalAlpha = 1;
    this.ctx.font = `bold 20px Bold`;
    this.ctx.fillText(
      this.text,
      this.h / 2 + this.x + this.w / 2,
      this.h / 2 + this.y - 20
    );
    // ----------------
  }

  showWholeProgressBar() {
    this.ctx.globalAlpha = 1;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(
      this.h / 2 + this.x,
      this.h / 2 + this.y,
      this.h / 2,
      Math.PI / 2,
      (3 / 2) * Math.PI
    );
    this.ctx.lineTo(this.w - this.h + this.x, 0 + this.y);
    this.ctx.arc(
      this.w - this.h / 2 + this.x,
      this.h / 2 + this.y,
      this.h / 2,
      (3 / 2) * Math.PI,
      Math.PI / 2
    );
    this.ctx.lineTo(this.h / 2 + this.x, this.h + this.y);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.globalAlpha = 0.8;
  }

  get PPercentage() {
    return this.percentage * 100;
  }

  set PPercentage(x) {
    this.percentage = x / 100;
  }
}
