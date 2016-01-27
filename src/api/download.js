import { Router } from 'express';
import zip from 'zipfolder';
import path from 'path';
import fs from '../utils/fs';
import Page from '../models/page';

const findOnePage = (pageId) => new Promise((resolve, reject) => {
  Page.findOne({_id: pageId}).then(page => {
    resolve(page);
  });
});

const router = new Router();

router.get('/:_id', async (req, res, next) => {
  try {
    const pageId = req.params._id;
    const page = await findOnePage(pageId);
    const pageName = page.name;
    const project = page.project;
    const folderPath = path.join(__dirname, '../publish', project, 'pages', pageName);
    const folderZipPath = folderPath + '.zip';
    const access = await fs.access(folderPath);
    if (access) {
      // const folderZipExists = await fs.exists(folderZipPath);
      await zip.zipFolder({folderPath: folderPath});
      res.download(folderZipPath);
    } else {
      res.status(404).send({
        retcode: 404,
        msg: 'zip 压缩包不存在'
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;

