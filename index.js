const fs = require('fs');
require('dotenv').config();
const { exec, execSync } = require('child_process');
console.log('Installing yarn.');
try {
  execSync('npm i -g yarn');
} catch (e) {
  console.log(e);
}

console.log('Building Rest');
try {
  execSync('yarn rest build');
} catch (e) {
  console.log(e);
}
console.log('Building Events');
try {
  execSync('yarn events build');
} catch (e) {
  console.log(e);
}
console.log('Building Gateway');
try {
  execSync('yarn gateway build');
} catch (e) {
  console.log(e);
}

const ls = exec('yarn rest dev');

ls.stdout.on('data', (data) => {
  console.log(data.toString('ascii').trim());
});

ls.stderr.on('data', (data) => {
  console.error(data.toString('ascii').trim());
});
function runBot() {
  const ls1 = exec('yarn events dev');

  ls1.stdout.on('data', (data) => {
    console.log(data.toString('ascii').trim());
  });

  ls1.stderr.on('data', (data) => {
    console.error(data.toString('ascii').trim());
  });

  ls1.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    runBot();
  });
}
runBot();

const ls2 = exec('yarn gateway dev');

ls2.stdout.on('data', (data) => {
  console.log(data.toString('ascii').trim());
});

ls2.stderr.on('data', (data) => {
  console.error(data.toString('ascii').trim());
});

ls2.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  runBot();
});
setInterval(() => {
  try {
    exec('git pull');
  } catch (e) {
    console.log(e);
  }
}, 60 * 1000);
