import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import Functions from '../../database/models/functions.js';
import Premium from '../../database/models/premium.js';
import moment from 'moment';
import uniqui from 'uniqid';
export default {
	name: 'redeem',
	description: 'Redeem a Premium code!',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'code',
			description: 'the premium code.',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const code = ctx.options.getLongString('text', true);
		let guildDB = await Functions.findOne({ Guild: ctx.guildId + '' });
		if (!guildDB)
			guildDB = new Functions({
				Guild: ctx.guildId + '',
			});
		if (guildDB.isPremium === 'true') {
			client.extras.errNormal(
				{
					error: `This guild is already premium.`,
				},
				ctx,
			);
		} else {
			const premium = await Premium.findOne({
				code: code,
			});
			if (premium) {
				const expires = moment(Number(premium.ExpiresAt)).format('dddd, MMMM Do YYYY HH:mm:ss');
				guildDB.isPremium = 'true';
				const data = {
					RedeemedBy: {
						id: ctx.author!.id + '',
						tag: ctx.author!.username + '#' + ctx.author!.discriminator,
					},
					RedeemedAt: Date.now() + '',
					ExpiresAt: premium.ExpiresAt,
					Plan: premium.Plan,
				};
				guildDB.Premium = data;
				await guildDB.save();
				await premium.deleteOne();

				const id = uniqui(undefined, `-${code}`);
				const redeemtime = moment(new Date()).format('dddd, MMMM Do YYYY HH:mm:ss');
				client.extras.embed(
					{
						desc: `**Premium Subscription**
                    
                    You've recently redeemed a code in **${ctx.guild.name}** and here is your receipt:

                    **Reciept ID:** ${id}
                    **Redeem Time:** ${redeemtime}
                    **Guild Name:** ${ctx.guild.name}
                    **Guild ID:** ${ctx.guild.id}`,
					},
					ctx.author!,
				);

				client.extras.embed(
					{
						desc: `**Congratulations!**

**${ctx.guild.name}** Is now a premium guild! Thanks a ton!

**Could not send your Reciept via dms so here it is:**
**Reciept ID:** ${id}
**Redeem Date:** ${redeemtime}
**Guild Name:** ${ctx.guild.name}
**Guild ID:** ${ctx.guild.id}

**Please make sure to keep this information safe, you might need it if you ever wanna refund / transfer servers.**

**Expires At:** ${expires}`,
					},
					ctx,
				);
			} else
				client.extras.errNormal(
					{
						error: `I was unable to find a premium code like that.`,
					},
					ctx,
				);
		}
	},
} as CommandOptions;
