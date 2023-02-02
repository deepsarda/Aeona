const fs = require('fs');
require('dotenv').config();
const { exec, execSync } = require('child_process');
console.log('Building Bot');
try {
  execSync('rm -rf packages/events/dist');
} catch (e) {
  console.log(e.toString('ascii').trim());
  try {
    execSync('rd /s /q packages\\events\\dist');
  } catch (e) {
    console.log(e.toString('ascii').trim());
  }
}
try {
  execSync('yarn events build');
} catch (e) {
  console.log(e.toString('ascii').trim());
}

function runBot() {
  const ls = exec('yarn events dev');

  ls.stdout.on('data', (data) => {
    console.log(data.toString('ascii').trim());
  });

  ls.stderr.on('data', (data) => {
    console.error(data.toString('ascii').trim());
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    runBot();
  });
}
runBot();
