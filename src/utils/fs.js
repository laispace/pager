import fs from 'fs';

import ncp from 'ncp';

const exists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const stat = filename => new Promise((resolve, reject) => {
  fs.stat(filename, (err, stat) => {
    if (err) {
      reject(err);
    } else {
      resolve(stat);
    }
  });
});

const access = filename => new Promise((resolve, reject) => {
  fs.access(filename, fs.R_OK, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(true);
    }
  });
});

const readFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const writeFile = (filename, content) => new Promise((resolve, reject) => {
  fs.writeFile(filename, content, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const readdir = filename => new Promise((resolve, reject) => {
  fs.readdir(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const copy = (source, destination, options) => new Promise((resolve, reject) => {
  options = options ? options : {};
  ncp(source, destination, options, function (err) {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

export default { exists, stat, access, readFile, writeFile, readdir, copy };
