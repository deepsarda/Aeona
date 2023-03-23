import { exec, execSync } from 'child_process';

console.log('Building Bot...');
try {
  execSync('rm -rf dist');
} catch (e) {
  console.log(e.toString('ascii').trim());
  try {
    execSync('rd /s /q dist');
  } catch (e) {
    console.log(e.toString('ascii').trim());
  }
}
try {
  console.log(execSync('yarn build').toString('ascii').trim());
} catch (e) {
  console.log(e.toString('ascii').trim());
}

function runBot(id) {
  const ls = exec('yarn start --id=' + id);

  ls.stdout.on('data', (data) => {
    console.log(data.toString('ascii').trim());
  });

  ls.stderr.on('data', (data) => {
    console.error(data.toString('ascii').trim());
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    runBot(id);
  });
}
let ids = ['931226824753700934'];
ids.forEach((id) => {
  runBot(id);
});

setInterval(() => {
  try {
    exec('git pull');
  } catch (e) {
    console.log(e);
  }
}, 60 * 1000);
