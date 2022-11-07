import { spawn } from 'child_process';
const ls = spawn('npm', ['run', 'devb']);

ls.stdout.on('data', (data) => {
	console.log(data.toString('ascii'));
});

ls.stderr.on('data', (data) => {
	console.error(data.toString('ascii'));
});

ls.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});
