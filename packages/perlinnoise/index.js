// Seeded Perlin Noise
//
// Based on the original by Ken Perlin:
//
// http://mrl.nyu.edu/~perlin/noise/
// http://mrl.nyu.edu/~perlin/paper445.pdf
//
// Seeding function based on code from:
// http://techcraft.codeplex.com/discussions/264014
//
// translated By Lee Grey 2012 - www.lgrey.com

function PerlinNoiseGenerator(seed) {
  this.p = new Array(512);
  //permutation from original by Ken Perlin:
  this.permutation;
  if (seed) {
    this.setSeed(seed);
  } else {
    for (var i = 0; i < 256; i++) {
      this.p[256 + i] = this.p[i] = this.permutation[i];
    }
  }
}

PerlinNoiseGenerator.prototype.p;
PerlinNoiseGenerator.prototype.permutation = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180,
];

PerlinNoiseGenerator.prototype.setSeed = function (seed) {
  seed = seed || 1337;
  this.permutation = []; //make permutation unique between instances
  if (SeededRandomNumberGenerator == undefined) {
    console.log(
      "PerlinNoiseGenerator.setSeed() - warning," +
        " SeededRandomNumberGenerator is undefined"
    );
    return;
  }
  var seedRND = new SeededRandomNumberGenerator();
  seedRND.seed = seed;
  var i;
  for (i = 0; i < 256; i++) {
    this.permutation[i] = i;
  }
  for (i = 0; i < 256; i++) {
    var k = seedRND.randomIntRange(0, 256 - i) + i; //(256 - i) + i;
    var l = this.permutation[i];
    this.permutation[i] = this.permutation[k];
    this.permutation[k] = l;
    this.permutation[i + 256] = this.permutation[i];
  }
  for (var i = 0; i < 256; i++) {
    this.p[256 + i] = this.p[i] = this.permutation[i];
  }
};

PerlinNoiseGenerator.prototype.noise = function (x, y, z) {
  // NOTE: "~~" is a faster approximation of Math.floor()
  // Modern browsers inline Math.floor(), so it may actually be faster...

  //Find unit cube that contains point
  var X = ~~x & 255;
  var Y = ~~y & 255;
  var Z = ~~z & 255;
  //Find relative x,y,z of point in cube
  x -= ~~x;
  y -= ~~y;
  z -= ~~z;
  //compute fade curves for each of x,y,z
  var u = this.fade(x);
  var v = this.fade(y);
  var w = this.fade(z);
  //hash coordinates of the 8 cube corners
  var A = this.p[X] + Y,
    AA = this.p[A] + Z,
    AB = this.p[A + 1] + Z;
  var B = this.p[X + 1] + Y,
    BA = this.p[B] + Z,
    BB = this.p[B + 1] + Z;
  return (
    //and add blended results from 8 corners of cube
    this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.p[AA], x, y, z),
          this.grad(this.p[BA], x - 1, y, z)
        ),
        this.lerp(
          u,
          this.grad(this.p[AB], x, y - 1, z),
          this.grad(this.p[BB], x - 1, y - 1, z)
        )
      ),
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1)
        ),
        this.lerp(
          u,
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)
        )
      )
    ) *
      0.5 +
    0.5
  ); // return value from 0.0 to 1.0, rather than -1.0 to 1.0
};

PerlinNoiseGenerator.prototype.fade = function (t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
};
PerlinNoiseGenerator.prototype.lerp = function (t, a, b) {
  return a + t * (b - a);
};
PerlinNoiseGenerator.prototype.grad = function (hash, x, y, z) {
  //convert LO 4 bits of hash code into 12 gradient directions
  var h = hash & 15;
  var u = h < 8 ? x : y;
  var v = h < 4 ? y : h == 12 || h == 14 ? x : z;
  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
};

module.exports = PerlinNoiseGenerator;
