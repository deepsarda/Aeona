import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'sponser',
	description: 'See our sponser',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		ctx.reply({
			content: `
			:Indionic: **__IndionicHost__ - Think, Build and Deploy**
			
			**#1・** What is "IndionicHost" ?
			
			> IndionicHost is an hosting company and our hosting partner. They have providing hosting at very affordable rates in the following regions, USA. Europe and Asia [ Mumbai ].
			
			**#2・** What is different in "IndionicHost"?
			
			> IndionicHost primary focus is Asian players and their servers. They provide Asian servers at affordable rates and in-Build DDoS Protection. IndionicHost also promises to provide **__99.8%__*** Uptime on off their services. If IndionicHost failed to finish its promise its SLA got you covered. IndionicHost also provides **__24/7__** free support and IndionicHost API for developers. 
			
			**#3・** What services does "IndionicHost" provide?
			
			> IndionicHost provides Game servers [ :flag_eu: / :flag_us: / :flag_in: ],  Web Hosting [:flag_us:], Bot Hosting [:flag_us:], VPS [:flag_eu: / :flag_us:], Dedicated servers [:flag_eu: / :flag_us:], Etc. They have a lot of brand-new services coming soon.
			
			**#4・** Is "IndionicHost" trusted and reliable? 
			
			> IndionicHost is providing their services for 1.5 Years without any performance issues they have delivered their promise to all of their clients followed by that IndionicHost have hosted someone of the top Asian networks, Websites and some big youtubers private SMP. [S8UL is Hosted on IndionicHost].
			
			**#5・** How to get started?
			> **__IndionicHost Discord__**: https://discord.gg/QX4UNJD252
			> **__IndionicHost website__**: <https://indionichost.com>
			`,
		});
	},
} as CommandOptions;
