import chalk from 'chalk';
import mongoose from 'mongoose';

export async function connect() {
	mongoose.connect(process.env.MONGO_CONNECTION!);

	mongoose.connection.once('open', () => {
		console.log(chalk.blue(chalk.bold(`System`)), chalk.white(`>>`), chalk.red(`MongoDB`), chalk.green(`is ready!`));
	});
}
