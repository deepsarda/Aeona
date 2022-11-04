export default {
	anylatics: '',
	port: process.env.PORT,
	https: process.env.DEV ? 'http' : 'https',
	url: process.env.DEV ? 'localhost' : process.env.WEBSITE!.split('://')[1],
	mongodb_url: process.env.MONGO_CONNECTION,
};
