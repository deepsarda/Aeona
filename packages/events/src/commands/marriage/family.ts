import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { Blob } from 'buffer';
import { Canvas, loadImage } from 'canvas';
import { BigString } from 'discordeno/types';

import Schema from '../../database/models/family.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'family',
  description: 'See your family',
  commandType: ['application', 'message'],
  category: 'marriage',
  args: [
    {
      name: 'user',
      description: 'Name of the user',
      required: false,
      type: 'User',
    },
  ],
  async execute(client: AeonaBot, context: Context) {
    if (!context.guild || !context.user || !context.channel) return;
    const target = (await context.options.getUser('user')) || context.user;

    const data = await Schema.findOne({
      User: `${target.id}`,
    });
    const canvas = new Canvas(720, 720);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(
      'https://media.discordapp.net/attachments/1012091823931527259/1054708120154284032/image.jpg',
    );

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial ';
    ctx.fillStyle = 'rgba(9, 226, 230, 0.5)';

    const parent = data && data.Parent.length > 0;
    const parent1 = parent ? data.Parent[0] : '';
    let json;
    if (parent) {
      json = await getFamily(parent1, client);
    } else {
      json = await getFamily(target.id, client);
    }

    const SIZE = [720, 720];
    const MIN_RADIAL_DISTANCE = 100;
    const FONT = '12px monospace';
    const CIRCLE_STYLE = '#bbb';
    const LINE_STYLE = '#999';
    const TEXT_STYLE = '#fff';
    const ANGLE = 0;
    const DISTANCE = 1;
    const X = 0;
    const Y = 1;

    function max(list) {
      // used for depth
      let m = list[0];
      for (const i in list) {
        if (list[i] > m) m = list[i];
      }
      return m;
    }

    function translate(reference, location) {
      // translate relative polar coords to absolute x/y
      const rad = (location[ANGLE] * 2 * Math.PI) / 360.0;
      return [
        reference[X] + location[DISTANCE] * Math.sin(rad),
        reference[Y] + location[DISTANCE] * Math.cos(rad),
      ];
    }

    function line(reference, location0, location1) {
      // draw a line using rel. polar coords
      ctx.strokeStyle = LINE_STYLE;
      location0 = translate(reference, location0);
      location1 = translate(reference, location1);
      ctx.beginPath();
      ctx.moveTo(location0[X], location0[Y]);
      ctx.lineTo(location1[X], location1[Y]);
      ctx.closePath();
      ctx.stroke();
    }

    function text(reference, location, string) {
      // draw centered text using rel. polar coords

      location = translate(reference, location);
      ctx.fillStyle = TEXT_STYLE;
      ctx.textBaseline = 'middle';
      ctx.font = FONT;
      const l = ctx.measureText(string).width / 2;
      ctx.fillText(string, location[X] - l, location[Y]);
    }

    function circle(reference, center, radius) {
      // draw a circle using rel. polar coords
      center = translate(reference, center);
      ctx.strokeStyle = CIRCLE_STYLE;
      ctx.beginPath();
      ctx.arc(center[X], center[Y], radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.stroke();
    }

    function display_line(reference, location, parent_location) {
      // draw line from child to parent
      if (parent_location != null) line(reference, location, parent_location);
    }

    function display_text(reference, location, node) {
      // draw text of a person - name and (optinally) spouse
      let str = node.name;
      if (typeof node.spouse !== 'undefined') {
        str += ` ∞ ${node.spouse}`;
      }
      text(reference, location, str);
    }

    function count_segments(branch: family, depth: number) {
      // count how wide and deep the tree will be. width is max(1, sum of childrens' width), depth is max(1, max(all of childrens' depth))
      branch.width = 0;
      branch.depth = depth;
      for (const c in branch.children) {
        count_segments(branch.children[c], depth + 1);
        branch.width += branch.children[c].width;
        branch.depth = max([branch.depth, branch.children[c].depth]);
      }
      branch.width = Math.max(1, branch.width);
    }

    function draw_segment(reference, data, angle, distance, parent_loc, delta) {
      // draw a node and its children recursively
      const display_loc = [angle + (delta[ANGLE] * data.width) / 2.5, distance]; // my display: in the angle-middle of all my children.

      display_line(reference, display_loc, parent_loc);
      for (const c_ in data.children) {
        const c = data.children[c_];
        draw_segment(reference, c, angle, distance + delta[DISTANCE], display_loc, delta);
        angle += c.width * delta[ANGLE];
      }

      display_text(reference, display_loc, data);
    }

    function draw(origin: [number, number], family_tree: family) {
      // draw a family tree relative to origin
      const delta = [
        360.0 / family_tree.width,
        max([MIN_RADIAL_DISTANCE, family_tree.width * 2.0]),
      ];

      let i;
      for (i = 1; i <= family_tree.depth; i++) {
        circle(origin, [0.0, 0.0], i * delta[DISTANCE]);
      }
      draw_segment(origin, family_tree, 0.0, 0.0, null, delta);
    }

    count_segments(json, 0);
    draw([SIZE[0] / 2, SIZE[1] / 2], json);

    context.reply({
      file: [
        {
          blob: await dataURItoBlob(canvas.toDataURL()).text(),
          name: 'family.png',
        },
      ],
    });
  },
} as CommandOptions;
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  // @ts-ignore
  return new Blob([ab], { type: 'image/jpeg' });
}

async function getFamily(userId: BigString, client: AeonaBot): Promise<family> {
  const data = await Schema.findOne({
    User: `${userId}`,
  });

  const user = await client.helpers.getUser(userId);
  if (!data)
    return {
      name: user.username,
      children: [],
      width: 0,
      depth: 0,
    };
  const children: any[] = [];
  if (data.Children)
    for (let i = 0; i < data.Children.length; i++) {
      children.push(await getFamily(data.Children[i], client));
    }

  return {
    name: user.username,
    spouse: data.Partner
      ? (await client.helpers.getUser(BigInt(data.Partner as string))).username
      : undefined,
    children,
    width: 0,
    depth: 0,
  };
}

type family = {
  name: string;
  spouse?: string;
  children: family[];
  width: number;
  depth: number;
};
