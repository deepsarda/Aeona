import { exec, execSync } from 'child_process';

console.log('Building Bot...');

async function removeBuildDirectory() {
  try {
    execSync('rm -rf build');
  } catch (e) {
    console.log(e.toString('ascii').trim());
    try {
      execSync('rd /s /q build');
    } catch (e) {
      console.log(e.toString('ascii').trim());
    }
  }
}

async function build() {
  try {
    await removeBuildDirectory();
    console.log(execSync('yarn build').toString('ascii').trim());
  } catch (e) {
    console.log(e.toString('ascii').trim());
  }
}

function runBot() {
  const ls = exec(`yarn start`);

  ls.stdout.on('data', (data) => {
    console.log(data.toString('ascii').trim());
  });

  ls.stderr.on('data', (data) => {
    console.error(data.toString('ascii').trim());
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    setTimeout(() => {
      runBot();
    }, 10 * 1000);
  });
}

async function main() {
  await build();

  runBot();

  setInterval(() => {
    try {
      exec('git pull');
    } catch (e) {
      console.log(e);
    }
  }, 60 * 1000);
}

main();
