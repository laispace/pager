import React from 'react';
import ReactDOM from 'react-dom/server';
import { Router } from 'express';
import Page from '../models/page';
import Body from '../components/PublishPage/body';
import Html from '../components/PublishPage/html';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from '../utils/fs';
import { compileTemplate } from '../utils/compile';
const router = new Router();

const findOnePage = (pageId) => new Promise((resolve, reject) => {
  Page.findOne({_id: pageId}).then(page => {
    resolve(page);
  });
});

router.post('/', async (req, res, next) => {
  try {
    const pageId = req.body.pageId;
    const page = await findOnePage(pageId);
    const props = {
      props: page.config.props
    };

    for (let i in page.components) {
      let component = page.components[i];
      if (component.project && component.name) {
        let filePath = path.join(__dirname, '../publish', component.project, 'components', component.name, 'Main.js');
        component.fileContent = await fs.readFile(filePath);
      }
    }

    // todo felix
    // props.body = ReactDOM.renderToStaticMarkup(<Body page={page} serverRendering={true} />);

    const data = await compileTemplate(page);
    props.script = data.fileContent.toString();

    const htmlString = ReactDOM.renderToStaticMarkup(<Html  {...props} />);
    const destHtml = data.outputPath + '/index.html';
    await fs.writeFile(destHtml, htmlString);
    res.status(200).send({
      retcode: 0
    });
  } catch (err) {
    next(err);
  }
});

export default router;

