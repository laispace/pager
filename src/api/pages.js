import { Router } from 'express';
import http from '../core/HttpClient';
import Page from '../models/page';
import Component from '../models/component';
import path from 'path';
import fs from '../utils/fs';
const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.find({});
    res.status(200).send({
      retcode: 0,
      title: '页面列表',
      pages: pages
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const exists = await Page.checkExistsByProjectAndName(req.body.project, req.body.name);
    if (exists) {
      res.status(200).send({
        retcode: 10001 // 项目名已存在
      });
    } else {
      const page = new Page({
        name: req.body.name,
        description: req.body.description,
        project: req.body.project,
        owner: req.body.owner,
        components: req.body.components,
        config: {
          "props": {

          },
          "properties": {
            "title": {
              "type": "string",
              "title": "页面标题"
            },
            "description": {
              "type": "string",
              "title": "页面描述"
            },
            "keywords": {
              "type": "array",
              "title": "关键字",
              "items": {
                "type": "string",
                "title": "关键字"
              }
            },
            "author": {
              "type": "string",
              "title": "作者"
            },
            "metas": {
              "type": "array",
              "title": "额外的 meta 标签",
              "items": {
                "type": "object",
                "title": "meta 标签",
                "properties": {
                  "name": {
                    "type": "string",
                    "enum": [
                      "name",
                      "http-equiv",
                      "itemprop"
                    ],
                    "default": "name"
                  },
                  "type": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string"
                  }
                }
              },
              "default": [
                {
                  "name": "name",
                  "type": "",
                  "content": ""
                }
              ]
            },
            "links": {
              "type": "array",
              "title": "外链样式",
              "items": {
                "title": "样式表地址",
                "properties": {
                  "href": {
                    "type": "string",
                    "title": "href"
                  }
                }
              }
            },
            "style": {
              "type": "string",
              "title": "内联样式",
            },
            "scripts": {
              "type": "array",
              "title": "外链脚本",
              "items": {
                "title": "脚本地址",
                "properties": {
                  "src": {
                    "type": "string"
                  }
                }
              }
            },
            "script": {
              "type": "string",
              "title": "内联脚本",
            }
          }
        }
      });
      const savedPage = await page.save();
      res.status(200).send({
        retcode: 0,
        title: '项目',
        page: savedPage
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const page = await Page.findOne({_id: _id}).lean();
    if (req.query.withFileContent) {
      for (let i in page.components) {
        let component = page.components[i];
        let filePath = path.join(__dirname, '../publish', component.project, 'components', component.name, 'Main.js');
        console.log('reading file and append content to page.components.fileContent: ', filePath);
        component.fileContent = await fs.readFile(filePath);
      }
    }
    res.status(200).send({
      retcode: 0,
      title: '页面',
      page: page
    });
  } catch (err) {
    next(err);
  }
});
router.delete('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const page = await Page.findOneAndRemove({_id: _id});
    res.status(200).send({
      retcode: 0,
      page: page
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const page = {
      name: req.body.name,
      description: req.body.description,
      project: req.body.project,
      owner: req.body.owner,
      components: req.body.components,
      config: req.body.config
    };
    const affectedPage = await Page.findOneAndUpdate({_id: _id}, page);
    res.status(200).send({
      retcode: 0,
      page: affectedPage
    });
  } catch (err) {
    next(err);
  }
});
export default router;

