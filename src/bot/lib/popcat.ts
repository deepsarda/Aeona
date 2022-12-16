import fetch from 'node-fetch';
const baseurl = 'https://api.popcat.xyz/';

async function request(endpoint: string, input = '') {
	const res = `${baseurl}${endpoint}?${input}`;
	return res;
}

export default {
	randomcolor: async () => {
		const color = await fetch('https://api.popcat.xyz/randomcolor').then((r) => r.json());
		return color;
	},

	periodicTable: async (element: string) => {
		if (!element) throw new Error("[Popcat Wrapper] periodicTable(element) ==> 'element' parameter is missing.");
		const res: any = await fetch(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(element)}`).then(
			(r) => r.json(),
		);
		if (res.error) throw new Error(res.error);
		return res;
	},

	jail: async function (imageURL: string) {
		if (!imageURL) throw new Error("[Popcat Wrapper] jail(imageURL) ==> 'imageURL' parameter is missing.");
		const url = `${baseurl}jail?image=${encodeURIComponent(imageURL)}`;
		return url;
	},

	unforgivable: async function (text: string) {
		if (!text) throw new Error("[Popcat Wrapper] unforgivable(text) ==> 'text' parameter is missing.");
		const url = `${baseurl}unforgivable?text=${encodeURIComponent(text)}`;
		return url;
	},

	imdb: async function (name: string) {
		if (!name) throw new Error("[Popcat Wrapper] imdb(name) ==> 'name' parameter is missing");
		const res: any = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(name)}`).then((r) => r.json());
		if (res.error) throw new Error(res.error);
		return res;
	},
	steam: async function (name: string) {
		if (!name) throw new Error("[Popcat Wrapper] steam(name) ==> 'name' parameter is missing.");
		const res = await fetch(`https://api.popcat.xyz/steam?q=${encodeURIComponent(name)}`);
		const text = await res.text();
		const json = JSON.parse(text);
		if (json.error) throw new Error(json.error);
		return json;
	},
	screenshot: async function (url: string) {
		if (!url) throw new Error("[Popcat Wrapper] screenshot(url) ==> 'url' parameter is missing.");
		const res = await fetch(`https://api.popcat.xyz/isurl?url=${encodeURIComponent(url)}`);
		const json: any = await res.json();
		if (json.isurl === false) throw new Error("[Popcat Wrapper] screenshot(url) ==> 'url' is not valid!");
		const img = `https://api.popcat.xyz/screenshot?url=${url}`;
		return img;
	},
	shorten: async function (url: string, extension: string) {
		if (!url || !extension)
			throw new Error("[Popcat Wrapper] shorten(url, extension) ==> 'url' or 'extension' parameter is missing");
		const res = await fetch(
			`https://api.popcat.xyz/shorten?url=${encodeURIComponent(url)}&extension=${encodeURIComponent(extension)}`,
		);
		const text = await res.text();
		const json = JSON.parse(text);
		if (json.error) throw new Error(json.error);
		return json.shortened;
	},
	lyrics: async function (song: string) {
		if (!song) throw new Error("[Popcat Wrapper] The field 'song' was left empty int he LYRICS function!");
		const res = await fetch(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
		const text = await res.text();
		const json = JSON.parse(text);
		if (json.error) throw new Error(json.error);
		return json;
	},
	quote: async function () {
		const res = await fetch('https://api.popcat.xyz/quote');
		const text = await res.text();
		const json = JSON.parse(text);
		return json;
	},
	car: async function () {
		const res = await fetch(`https://api.popcat.xyz/car`);
		const text = await res.text();
		const json = JSON.parse(text);
		return json;
	},
	showerthought: async function () {
		const res = await fetch(`https://api.popcat.xyz/showerthoughts`);
		const text = await res.text();
		const json = JSON.parse(text);
		return json;
	},
	subreddit: async function (subreddit: string) {
		if (!subreddit) throw new Error("[Popcat Wrapper] The field 'subeddit' was left empty in the SUBREDDIT function!");
		const res = await fetch(`https://api.popcat.xyz/subreddit/${encodeURIComponent(subreddit)}`);
		const text = await res.text();
		const json = JSON.parse(text);
		return json;
	},
	oogway: async function (text: string) {
		if (!text) throw new Error("[Popcat Wrapper] The field 'text' was left empty in the OOGWAY function!");
		const img = `https://api.popcat.xyz/oogway?text=${encodeURIComponent(text)}`;
		return img;
	},
	opinion: async function (image: string, text: string) {
		if (!image) throw new Error("[Popcat Wrapper] The field 'image' was left empty in the OPINION function!");
		if (!text) throw new Error("[Popcat Wrapper] The field 'text' was left empty in the OPINION function!");
		const img = `https://api.popcat.xyz/opinion?image=${encodeURIComponent(image)}&text=${encodeURIComponent(text)}`;
		return img;
	},
	wanted: async function (image: string) {
		if (!image) throw new Error("[Popcat Wrapper] The field 'image' was left empty in the WANTED function!");
		const url = `https://api.popcat.xyz/wanted?image=${encodeURIComponent(image)}`;
		return url;
	},
	sadcat: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the SAD CAT function. Need help? https://popcat.xyz/server",
			);
		const url = `${baseurl}sadcat?text=${encodeURIComponent(text)}`;
		return url;
	},
	github: async function (username: string) {
		if (!username) throw new Error("[Popcat Wrapper] The field 'username' was left empty in the GITHUB function!");
		const res = await fetch(`https://api.popcat.xyz/github/${encodeURIComponent(username)}`);
		const js = await res.text();
		const obj = JSON.parse(js);
		if (obj.error) throw new Error('[Popcat Wrapper] Invalid username in the github function!');
		return obj;
	},
	weather: async function (place: string) {
		if (!place) throw new Error("[Popcat Wrapper] The field 'place' was left empty in the WEATHER function!");
		const res = await fetch(`https://api.popcat.xyz/weather?q=${encodeURIComponent(place)}`);
		const js = await res.text();
		const obj = JSON.parse(js);
		if (obj.error) throw new Error('[Popcat Wrapper] Invalid place in the weather function!');
		return obj;
	},
	lulcat: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the LUL CAT function. Need help? https://popcat.xyz/server",
			);
		const url = `${baseurl}lulcat?text=${encodeURIComponent(text)}`;
		const res = await fetch(url);
		const final: any = await res.json();
		const t = final.text;
		return t;
	},
	gun: async function (image: string) {
		if (!image) throw new Error("[Popcat Wrapper] The field 'image' was left empty in the GUN function!");
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('gun', input);
		return res;
	},
	country: async function (name: string) {
		if (!name) throw new Error("[Popcat Wrapper] The field 'country name' was left empty in the COUNTRY function!");
		const res = await fetch(`${baseurl}countries/${encodeURIComponent(name)}`);
		const js = await res.text();
		const obj = JSON.parse(js);
		if (obj.error) throw new Error('[Popcat Wrapper] Invalid country in the COUNTRY function!');
		return obj;
	},
	banner: async function (uid: string) {
		if (!uid) throw new Error("[Popcat Wrapper] The field 'user id' was left empty in the BANNER function!");
		const res = await fetch(baseurl + 'banners/' + uid);
		const obj = await res.text();
		const js = JSON.parse(obj);
		return js;
	},
	npm: async function (pkg: string) {
		if (!pkg) throw new Error("[Popcat Wrapper] The field 'package name' was left empty in the NPM function!");
		const url = `https://api.popcat.xyz/npm?q=${encodeURIComponent(pkg)}`;
		const res = await fetch(url);
		const obj = await res.text();
		const js = JSON.parse(obj);
		if (js.error) throw new Error(js.error);
		else {
			return js;
		}
	},
	fact: async function () {
		const url = `https://api.popcat.xyz/fact`;
		const fa = await fetch(url);
		const fact: any = await fa.json();
		const final = fact.fact;
		return final;
	},
	instagramUser: async function (username: string) {
		if (!username)
			throw new Error("[Popcat Wrapper] The field 'username' was left empty in the instagramUser function!");
		const name = username;
		const url = `https://api.popcat.xyz/instagram?user=${name.split(' ').join('_')}`;
		const res = await fetch(url);
		const account = await res.text();
		if (account.includes('error')) throw new Error('[Popcat Wrapper] Not a valid instagram user!');
		const js = JSON.parse(account);
		return js;
	},
	drake: async function (text1: string, text2: string) {
		if (!text1) throw new Error('The field text1 was left empty in the drake function');
		if (!text2) throw new Error('The field text2 was left empty in the drake function');
		const input = `text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
		const response = await request('drake', input);
		return response;
	},
	pooh: async function (text1: string, text2: string) {
		if (!text1) throw new Error('The field text1 was left empty in the pooh function');
		if (!text2) throw new Error('The field text2 was left empty in the pooh function');
		const input = `text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
		const response = await request('pooh', input);
		return response;
	},
	ship: async function (image1: string, image2: string) {
		if (!image1)
			throw new Error('The field image1 was left empty in the ship function. Need help? https://dsc.gg/popcatcom');
		if (!image2)
			throw new Error('The field image2 was left empty in the ship function. Need help? https://dsc.gg/popcatcom');
		const input = `user1=${encodeURIComponent(image1)}&user2=${encodeURIComponent(image2)}`;
		const response = await request('ship', input);
		return response;
	},
	colorify: async function (image: string, color: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the colorify function. Need help? https://dsc.gg/popcatcom",
			);
		if (!color)
			throw new Error(
				"[Popcat Wrapper] The field 'color' was left empty in the colorify function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}&color=${encodeURIComponent(color)}`;
		const res = await request('colorify', input);
		return res;
	},
	biden: function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the biden function. Need help? https://dsc.gg/popcatcom",
			);
		const res = `https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`;
		return res;
	},

	pikachu: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the pikachu function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await request('pikachu', text);
		return res;
	},
	drip: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the drip function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('drip', input);
		return res;
	},
	clown: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the clown function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('clown', input);
		return res;
	},
	translate: async function (text: string, to: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the translate function. Need help? https://dsc.gg/popcatcom",
			);
		if (!to)
			throw new Error(
				"[Popcat Wrapper] The field 'to' was left empty in the translate function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}&to=${encodeURIComponent(to)}`;
		const res = await fetch('https://api.popcat.xyz/translate?' + input);
		const json: any = await res.json();
		return json.translated;
	},
	reverse: async function (text: string) {
		if (!text) throw new Error("[Popcat Wrapper] The field 'text' was left empty in the reverse function");
		const res = await fetch(`https://api.popcat.xyz/reverse?text=${encodeURIComponent(text)}`);
		const json: any = await res.json();
		return json.text;
	},
	uncover: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the uncover function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('uncover', input);
		return res;
	},
	ad: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the ad function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('ad', input);
		return res;
	},
	blur: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the blur function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('blur', input);
		return res;
	},
	invert: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the invert function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('invert', input);
		return res;
	},
	greyscale: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the greyscale function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('greyscale', input);
		return res;
	},
	alert: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the alert function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await request('alert', input);
		return res;
	},
	caution: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the caution function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await request('caution', input);
		return res;
	},
	colorinfo: async function (color: string) {
		if (!color)
			throw new Error(
				"[Popcat Wrapper] The field 'color' was left empty in the colorinfo function. Need help? https://dsc.gg/popcatcom",
			);
		let colour = color;
		if (colour.includes('#')) colour = colour.split('#')[1];
		const res = await fetch(`https://api.popcat.xyz/color/${encodeURIComponent(colour)}`);
		const json = await res.text();
		if (json.includes('error')) throw new Error("[Popcat Wrapper] Invalid hex in the 'colorinfo' function!");
		const obj = JSON.parse(json);
		return obj;
	},
	jokeoverhead: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the jokeoverhead function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('jokeoverhead', input);
		return res;
	},
	mnm: async function (image: string) {
		if (!image)
			throw new Error(
				"[Popcat Wrapper] The field 'image' was left empty in the mnm function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `image=${encodeURIComponent(image)}`;
		const res = await request('mnm', input);
		return res;
	},
	mock: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the mock function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await fetch('https://api.popcat.xyz/mock?' + input);
		const json: any = await res.json();
		return json.text;
	},
	doublestruck: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the doublestruck function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await fetch('https://api.popcat.xyz/doublestruck?' + input);
		const json: any = await res.json();
		return json.text;
	},

	texttomorse: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the texttomorse function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await fetch('https://api.popcat.xyz/texttomorse?' + input);
		const json: any = await res.json();
		return json.morse;
	},
	wouldyourather: async function () {
		const res = await fetch('https://api.popcat.xyz/wyr');
		const json = await res.text();
		const e = JSON.parse(json);
		return e;
	},
	randommeme: async function () {
		const res = await fetch('https://api.popcat.xyz/meme');
		const json = await res.text();
		const obj = JSON.parse(json);
		return obj;
	},
	welcomecard: async function welcomecard(
		background: string,
		avatar: string,
		text_1: string,
		text_2: string,
		text_3: string,
	) {
		if (!background)
			throw new SyntaxError('welcomeImage(background, avatar, text_1, text_2, text_3, color) ==> background is null.');
		if (!background.startsWith('https://'))
			throw new Error(
				'[Popcat Wrapper] welcomecard(background, avatar, text_1, text_2, text_3) ==> background must be a valid URL.',
			);
		if (!background.endsWith('.png'))
			throw new Error(
				'[Popcat Wrapper] welcomecard(background, avatar, text_1, text_2, text_3) ==> background must be a PNG.',
			);
		if (!avatar) throw new SyntaxError('welcomecard(background, avatar, text_1, text_2, text_3) ==> avatar is null');
		if (!text_1) throw new SyntaxError('welcomecard(background, avatar, text_1, text_2, text_3) ==> text_1 is null');
		if (!text_2) throw new SyntaxError('welcomecard(background, avatar, text_1, text_2, text_3) ==> text_2 is null');
		if (!text_3) throw new SyntaxError('welcomecard(background, avatar, text_1, text_2, text_3) ==> text_3 is null');
		const input = `background=${encodeURIComponent(background)}&avatar=${encodeURIComponent(
			avatar,
		)}&text1=${encodeURIComponent(text_1)}&text2=${encodeURIComponent(text_2)}&text3=${encodeURIComponent(text_3)}`;
		const welcomeimg = await request('welcomecard', input);
		return welcomeimg;
	},
	itunes: async function (x: string) {
		if (!x) throw new Error("[Popcat Wrapper] The field 'song' was left empty in the iTunes function.");
		const res = await fetch(`https://api.popcat.xyz/itunes?q=${encodeURIComponent(x)}`);
		const json = await res.text();
		if (json.includes('error')) throw new Error('[Popcat Wrapper] Song Not found on iTunes!');
		const obj = JSON.parse(json);
		return obj;
	},
	chatbot: async function (x: string, ownername: string, botname: string) {
		if (!x) throw new Error("[Popcat Wrapper] The field 'content' was left empty in the chatbot function.");
		if (!ownername) throw new Error("[Popcat Wrapper] The field 'ownername' was left empty in the chatbot function.");
		if (!botname) throw new Error("[Popcat Wrapper] The field 'botname' was left empty in the chatbot function.");
		const res = await fetch(
			`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(x)}&owner=${encodeURIComponent(
				ownername,
			)}&botname=${encodeURIComponent(botname)}`,
		);
		const resp: any = await res.json();
		return resp.response;
	},
	playstore: async function (app: string) {
		if (!app) throw new Error("[Popcat Wrapper] The field 'appname' was left empty in the playstore function.");
		const res = await fetch(`https://api.popcat.xyz/playstore?q=${encodeURIComponent(app)}`);
		const json = await res.text();
		const obj = JSON.parse(json);
		return obj;
	},
	joke: async function () {
		const res = await fetch('https://api.popcat.xyz/joke');
		const json: any = await res.json();
		return json.joke;
	},
	encode: async function (text: string) {
		if (!text)
			throw new Error(
				"[Popcat Wrapper] The field 'text' was left empty in the encode function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `text=${encodeURIComponent(text)}`;
		const res = await fetch(`https://api.popcat.xyz/encode?${input}`);
		const json: any = await res.json();
		return json.binary;
	},
	decode: async function (binary: string) {
		if (!binary)
			throw new Error(
				"[Popcat Wrapper] The field 'binary' was left empty in the decode function. Need help? https://dsc.gg/popcatcom",
			);
		const input = `binary=${encodeURIComponent(binary)}`;
		const res = await fetch(`https://api.popcat.xyz/decode?${input}`);
		const json: any = await res.json();
		return json.text;
	},
	facts: async function (text: string) {
		if (!text) throw new Error("[Popcat Wrapper] The field 'text' was left empty in the facts functuion.");
		const input = `text=${encodeURIComponent(text)}`;
		const res = await request('facts', input);
		return res;
	},
	_8ball: async function () {
		const res = await fetch('https://api.popcat.xyz/8ball');
		const json: any = await res.json();
		return json.answer;
	},
};
