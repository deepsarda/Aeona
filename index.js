import { spawn, execSync } from 'child_process';
try {
	execSync('npm rebuild');
} catch (e) {
	console.log(e);
}
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
