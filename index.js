import { spawn, execSync } from 'child_process';
import fs from 'fs';
try{
fs.rmdirSync('./dist', {
	recursive: true,
	force: true,
});
}catch(e){
	//fix lint
}

try {
	execSync('npm rebuild');
} catch (e) {
	console.log(e);
}

try {
	execSync('npm run build');
} catch (e) {
	console.log(e);
}
const ls = spawn('npm', ['run', 'startr']);

ls.stdout.on('data', (data) => {
	console.log(data.toString('ascii'));
});

ls.stderr.on('data', (data) => {
	console.error(data.toString('ascii'));
});


const ls1 = spawn('npm', ['run', 'startb']);

ls1.stdout.on('data', (data) => {
	console.log(data.toString('ascii'));
});

ls1.stderr.on('data', (data) => {
	console.error(data.toString('ascii'));
});


ls1.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});
