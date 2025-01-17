import { join } from 'path';
import fs, { existsSync } from 'fs';
import { execSync } from 'child_process';
import { BasicMessages, AnsiEscapes } from './log';
import { version, dependencies } from '../package.json';

const rootPath = join(__dirname, '..');
const nodeModulesPath = join(rootPath, 'node_modules');

function installDeps () {
  console.log('Installing dependencies, please wait...');
  execSync('npm install --only=prod', {
    cwd: rootPath,
    stdio: [ null, null, null ]
  });
  console.log('Dependencies successfully installed!');
}

// Don't clone in System32
if (__dirname.toLowerCase().replace(/\\/g, '/').includes('/windows/system32')) {
  console.log(BasicMessages.PLUG_FAILED, '\n');
  console.log(
    'Replugged detected that you are trying to install Replugged in the System32 folder.'
  );
  console.log(
    'This shouldn\'t be done as it will prevent Replugged from functioning as expected.',
    '\n'
  );
  console.log(
    'This is most likely caused by you opening the command prompt as an administrator.'
  );
  console.log(
    `Try re-opening your command prompt ${AnsiEscapes.BOLD}without${AnsiEscapes.RESET} opening it as administrator.`
  );
  process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
}

// Verify if we're on node 10.x
if (!fs.promises) {
  console.log(BasicMessages.PLUG_FAILED, '\n');
  console.log(
    'Replugged detected you\'re running an outdated version of NodeJS.'
  );
  console.log(
    'You must have at least NodeJS 10 installed for Replugged to function.',
    '\n'
  );
  console.log(
    'You can download the latest version of NodeJS at https://nodejs.org'
  );
  process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
}

// Verify if deps have been installed. If not, install them automatically
if (!existsSync(nodeModulesPath)) {
  installDeps();
} else {
  for (const dependency in dependencies) {
    const depPath = join(nodeModulesPath, dependency);
    if (!existsSync(depPath)) {
      installDeps();
      break;
    }
    const expectedVerInt = parseInt(
      dependencies[dependency as keyof typeof dependencies].replace(/[^\d]/g, '')
    );
    const installedVerInt = parseInt(version.replace(/[^\d]/g, ''));
    if (installedVerInt < expectedVerInt) {
      installDeps();
      break;
    }
  }
}
