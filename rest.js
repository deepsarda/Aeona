const fs = require('fs');
require('dotenv').config();
const { exec, execSync } = require('child_process');
try {
  execSync('rm -rf packages/rest/dist');
} catch (e) {
  console.log(e.toString('ascii').trim());
  try {
    execSync('rd /s /q packages\\rest\\dist');
  } catch (e) {
    console.log(e.toString('ascii').trim());
  }
}
console.log('Building Rest');
try {
  execSync('yarn rest build');
} catch (e) {
  console.log(e.toString('ascii').trim());
}

function runRest() {
  const ls = exec('yarn rest dev');

  ls.stdout.on('data', (data) => {
    console.log(data.toString('ascii').trim());
  });

  ls.stderr.on('data', (data) => {
    console.error(data.toString('ascii').trim());
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    runRest();
  });
}
runRest();
