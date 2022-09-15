import { SimpleCommandMessage } from "discordx";
import { ColorResolvable, CommandInteraction, EmbedBuilder, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import config from "../config/embed.js";

async function respond(
  interaction: SimpleCommandMessage | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | CommandInteraction,
  options: RespondOptions
) {
  const embeds: EmbedBuilder[]= [];
  const message = {
    content: options.content,
    embeds:embeds,
    components: options.components,
    files: options.files,
  };


  if(options.title || options.description || options.authorName){
    const embedOptions={
      title: options.title,
      description: options.description,
      fields: options.fields,
      imageURL: options.imageURL,
      thumbnailURL: options.thumbnailURL,
    }

    const embed= EmbedBuilder.from(embedOptions);
    embed.setColor((options.color?options.color:( options.error? config.wrongcolor: config.color )) as ColorResolvable);
    if(options.authorName)
      embed.setAuthor({
        name: options.authorName,
        iconURL: options.authorIconUrl ,
        url: options.url
      })
    
    if(options.thumbnailURL) embed.setThumbnail(options.thumbnailURL);
    if(options.imageURL) embed.setImage(options.imageURL);

    embed.setFooter({
      text: options.footerText? options.footerText+" "+config.footertext: config.footertext,
      iconURL: options.footerIconUrl || config.footericon
    });
    message.embeds.push(embed);

  }
  if (options.embed) return message;
  if (interaction instanceof SimpleCommandMessage) 
    return await interaction.message.reply(message);
   else 
    return await interaction.editReply(message);
  
}

export default respond;

type RespondOptions = {
  title?: string;
  description?: string;
  content?: string;
  imageURL?: string;
  thumbnailURL?: string;
  fields?: FieldOptions[];
  components?: [];
  files?: [];
  embed?: boolean;
  error?: string;
  color?:string;
  authorName?:string;
  authorIconUrl?:string;
  url?:string;
  footerText?: string;
  footerIconUrl?: string;

};

type FieldOptions = {
  name: string;
  value: string;
  inline?: boolean;
};
