import path from 'path';
import replace from 'replace';
import Promise from 'bluebird';

async function copy() {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/public', 'build/public'),
    ncp('package.json', 'build/package.json'),
    ncp('src/index.html', 'build/index.html'),
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js"',
    paths: ['build/package.json'],
    recursive: false,
    silent: false,
  });
}

export default copy;
