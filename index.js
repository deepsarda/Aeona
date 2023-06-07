import { exec, execSync } from 'child_process';
import path from 'path';

console.log('Building Bot...');

async function removeDistDirectory() {
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
}

async function buildAndCopyFiles() {
  try {
    console.log(execSync('yarn build').toString('ascii').trim());
    console.log(execSync(`cp -R ${path.join('src', 'website', 'views')} ${path.join('dist', 'website')}`).toString('ascii').trim());
    console.log(execSync(`cp -R ${path.join('src', 'website', 'public')} ${path.join('dist', 'website')}`).toString('ascii').trim());
  } catch (e) {
    console.log(e.toString('ascii').trim());
  }
}

function runBot(id) {
  const ls = exec(`yarn start --id=${id}`);

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

async function main() {
  await removeDistDirectory();
  await buildAndCopyFiles();

  const ids = ['931226824753700934'];
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
}

main();
