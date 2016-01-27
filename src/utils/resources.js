import fs from './fs';
import path from 'path';

const basedir = path.join(__dirname, '../src/resources/');

async function getComponent(project, name) {
  const configPath = path.join(basedir, project, 'components', name, 'package.json');
  let config = await fs.readFile(configPath);
  config = JSON.parse(config);
  const result = {
    project: project,
    name: name,
    config: config
  };
  return result;
}

async function getComponents() {
  let results = [];
  const projects = await fs.readdir(basedir);
  for (const project of projects) {
    const componentDir = path.join(basedir, project, 'components');
    const components = await fs.readdir(componentDir);
    for (const name of components) {
      const result = await getComponent(project, name);
      results.push(result);
    }
  }
  return results;
}

export default { getComponent, getComponents };
