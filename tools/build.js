import run from './run';

async function build() {
  await run(require('./clean'));
  await run(require('./copy'));
  await run(require('./bundle'));
}

export default build;

