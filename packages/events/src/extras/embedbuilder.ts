import { Components } from '@thereallonewolf/amethystframework';
import { Guild, User } from 'discordeno/transformers';
import { AeonaBot } from 'extras';

export default (client: AeonaBot) => {
  function createComponents() {
    const comp = new Components();
    comp.addButton('Set Author', 'Success', 'setauthor');
    comp.addButton('Set Thumbnail', 'Success', 'setthumbnail');
    comp.addButton('Set Url', 'Success', 'seturl');
    comp.addButton('Set Content', 'Success', 'setcontent');
    comp.addActionRow();
    comp.addButton('Add Field', 'Success', 'addfield');
    comp.addButton('Remove Field', 'Success', 'removefield');
    comp.addActionRow();
    comp.addButton('Set Title', 'Success', 'settitle');
    comp.addButton('Set Description', 'Success', 'setdescription');
    comp.addButton('Set Image', 'Success', 'setimage');
    comp.addButton('Set Footer', 'Success', 'setfooter');
    comp.addButton('Set Color', 'Success', 'setcolor');
    comp.addActionRow();
    comp.addButton('Send/Edit Embed', 'Success', 'sendembed');
    comp.addButton('Save Embed', 'Success', 'saveembed');
    comp.addButton('Load Saved Embed', 'Success', 'loadembed');

    return comp;
  }

  function generateEmbed(
    options: {
      user: User;
      guild: Guild;
      levels?: { level: number; xp: number };
      inviter?: {
        user?: User;
        invites?: number;
        left?: number;
      };
    },
    embedData: Embed,
  ) {
    createComponents();
  }

  return {
    generateEmbed,
  };
};

type Embed = {
  author?: {
    name: string;
    icon?: string;
    url: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: string;
  }[];
  thumbnail?: string;
  image?: string;
  footer?: {
    text: string;
    icon?: string;
  };
};
