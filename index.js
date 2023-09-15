import { exec, execSync } from 'child_process';

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
