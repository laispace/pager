import path from 'path';
import cp from 'child_process';
import watch from './lib/watch';
import Component from '../src/models/component';
import { getComponent, getComponents } from '../src/utils/resources';
import { compileComponent } from '../src/utils/compile';

var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

console.log('global.config', global.config);

async function watchResources() {
  var io = require('socket.io')(9999);
  io.on('connection', function (socket) {
    event.on('component', (component) => {
      socket.emit('component', component);
    });
  });

  console.log('watching: ', path.join(__dirname, '../src/resources/**/*'));
  watch(path.join(__dirname, '../src/resources/**/*')).then(watcher => {
    watcher.on('changed', (filePath) => {
      console.log('file changed: ', filePath);
      // [\/\\] 是为了兼容 windows 下路径分隔的反斜杠
      const re = /resources[\/\\](.*)[\/\\]components[\/\\](.*)[\/\\](.*)/;
      const results = filePath.match(re);
      if (results && results[1] && results[2]) {
        event.emit('component', {
          project: results[1],
          component: results[2]
        });
      }
    });
  });
}

export default watchResources;
