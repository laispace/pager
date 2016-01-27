import React from 'react';
import ReactDOM from 'react-dom/server';
import { Router } from 'express';
import Page from '../models/page';
import Project from '../models/project';
import path from 'path';
import fs from '../utils/fs';
const router = new Router();

const findOnePage = (pageId) => new Promise((resolve, reject) => {
  Page.findOne({_id: pageId}).then(page => {
    resolve(page);
  });
});
const findOneProjectByName = (name) => new Promise((resolve, reject) => {
  Project.findOne({name: name}).then(project => {
    resolve(project);
  });
});

router.post('/', async (req, res, next) => {
  try {
    const pageId = req.body.pageId;
    const page = await findOnePage(pageId);
    const project = await findOneProjectByName(page.project);
    const exec = require('child_process').exec;
    const src = path.join(__dirname, '../', 'publish/', page.project, 'pages', page.name);
    const dest = `${project.publishIp}:${project.publishPath}`;

    // todo password should not be set with plaintext
    const command = `rsync -avzP ${src} ${dest}`;
    console.log('rsync executing: ', command);
    const rsync = exec(command, {});
    rsync.stdout.on('data', (data) => {
      console.log('rsync: ' + data);
    });
    rsync.stderr.on('data', function (data) {
      console.log('rsync stderr: ' + data);
      res.status(200).send({
        retcode: 500,
        msg: 'rsync stderr' + data
      });
    });
    rsync.on('exit', function (code) {
      console.log('rsync exited with code ' + code);
      if (code === 0) {
        res.status(200).send({
          retcode: 0,
          publishUrl: `${project.baseUrl}${page.name}`,
          msg: 'rsync success'
        });
      } else {
        res.status(200).send({
          retcode: 500,
          msg: 'rsync error'
        });
      }

    });
  } catch (err) {
    next(err);
  }
});

export default router;

