import { exec, execSync } from 'child_process';
import fs from 'fs';
try {
	fs.rmdirSync('./dist', {
		recursive: true,
		force: true,
	});
} catch (e) {
	//fix lint
}

try {
	execSync('npm i');
} catch (e) {
	console.log(e);
}

try {
	execSync('npm run build');
} catch (e) {
	console.log(e);
}
const ls = exec('npm run startr');

ls.stdout.on('data', (data) => {
	console.log(data.toString('ascii').trim());
});

ls.stderr.on('data', (data) => {
	console.error(data.toString('ascii').trim());
});

const ls1 = exec('npm run devb');

ls1.stdout.on('data', (data) => {
	console.log(data.toString('ascii').trim());
});

ls1.stderr.on('data', (data) => {
	console.error(data.toString('ascii').trim());
});

ls1.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});

const ls2 = exec('npm run startg');

ls2.stdout.on('data', (data) => {
	console.log(data.toString('ascii').trim());
});

ls2.stderr.on('data', (data) => {
	console.error(data.toString('ascii').trim());
});

ls2.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});

setInterval(() => {
	try {
		execSync('git pull');
	} catch (e) {
		console.log(e);
	}
}, 60 * 1000);
