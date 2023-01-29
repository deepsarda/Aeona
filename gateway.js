const fs = require('fs');
require('dotenv').config();
const { exec, execSync } = require('child_process');
console.log('Building Gateway');
try {
  execSync('yarn gateway build');
} catch (e) {
  console.log(e.toString('ascii').trim());
}

function runGateWay() {
  const ls = exec('gateway events dev');

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
runGateWay();
